// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// Camera (fixed, no orbit controls)
const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
const isMobile = window.innerWidth <= 600;
camera.position.set(0, 5, isMobile ? 150 : 200); // نزدیک‌تر کردن دوربین در موبایل برای نمایش کامل
camera.lookAt(0, 5, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
const container = document.getElementById('scene-container');
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);
camera.aspect = container.clientWidth / container.clientHeight;
camera.updateProjectionMatrix();

// Clock for animations
const clock = new THREE.Clock();

// Light
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const sun = new THREE.DirectionalLight(0xfff5e1, 1.2);
sun.position.set(50, 100, 50);
scene.add(sun);

// Text setup
const textMeshes = [];
const startString = isMobile ? "xino" : "xinosazeh"; // فقط "xino" در موبایل، کلمه کامل در دسکتاپ
const loader = new THREE.FontLoader();
loader.load(
  "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
  function (font) {
    const material = new THREE.MeshStandardMaterial({
      color: 0x0000ff,
      metalness: 0.3,
      roughness: 0.6,
    });
    const total = startString.length;
    const size = isMobile ? 30 : 40; // اندازه بزرگ‌تر در موبایل چون کلمه کوتاه‌تره
    const spacing = isMobile ? 30 : 48; // فاصله مناسب در موبایل
    const offset = ((total - 1) * spacing) / 2;
    const targetY = 5;

    startString.split("").forEach((char, i) => {
      const geom = new THREE.TextGeometry(char, {
        font: font,
        size: size,
        height: 1,
        curveSegments: 12,
      });
      const mesh = new THREE.Mesh(geom, material.clone());
      
      // موقعیت اولیه سفارشی برای ورود از سمت چپ یا راست
      let initialX;
      if (i < 4) { // "xino" از سمت چپ (x منفی) - در موبایل همه از چپ میان
        initialX = -100 - Math.random() * 50; // از -100 تا -150 برای ورود از چپ
      } else { // "sazeh" از سمت راست (x مثبت) - فقط در دسکتاپ
        initialX = 100 + Math.random() * 50; // از +100 تا +150 برای ورود از راست
      }
      
      mesh.position.set(
        initialX,
        (Math.random() - 0.5) * 100 + targetY, // y رندوم نگه داشته شده
        (Math.random() - 0.5) * 50 // z رندوم نگه داشته شده
      );
      mesh.userData.initialZ = mesh.position.z;
      scene.add(mesh);
      const target = new THREE.Vector3(i * spacing - offset, targetY, 0);
      textMeshes.push({
        mesh,
        start: mesh.position.clone(),
        target,
        t: 0,
        fadePhase: i % 2 === 0 ? 0 : Math.PI, // یک در میان
        originalColor: new THREE.Color(0x0000ff),
        fadeColor: new THREE.Color(0xffffff),
      });
    });

    // Enable dragging with free X and Y movement, fixed Z
    const draggable = textMeshes.map((obj) => obj.mesh);
    const dragControls = new THREE.DragControls(draggable, camera, renderer.domElement);
    dragControls.addEventListener("dragstart", function () {
      renderer.domElement.classList.add("grabbing");
    });
    dragControls.addEventListener("drag", function (event) {
      event.object.position.z = event.object.userData.initialZ; // Fix Z axis
    });
    dragControls.addEventListener("dragend", function () {
      renderer.domElement.classList.remove("grabbing");
      lastInteractionTime = clock.getElapsedTime();
    });
  }
);

// Animation loop
let lastInteractionTime = 0;
const fadeSpeed = 0.5;
const amplitude = 1.5; // 3 پیکسل بالا و پایین (1.5 * 2 = 3)
function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();

  textMeshes.forEach((obj) => {
    if (obj.t < 1) {
      obj.t += 0.005;
      const p = 1 - Math.pow(1 - obj.t, 2);
      obj.mesh.position.lerpVectors(obj.start, obj.target, p);
    } else {
      // Fading animation: alternate fading to white and back
      const fadeValue = Math.sin(time * fadeSpeed + obj.fadePhase) * 0.5 + 0.5;
      const color = new THREE.Color().lerpColors(obj.originalColor, obj.fadeColor, fadeValue);
      obj.mesh.material.color = color;

      // Soft vertical movement synchronized with fading
      const oscillationY = amplitude * Math.sin(time * fadeSpeed + obj.fadePhase);
      obj.mesh.position.y = obj.target.y + oscillationY;
    }
  });

  // Reset all letters after 30 seconds of inactivity
  if (time - lastInteractionTime > 30) {
    textMeshes.forEach((obj) => {
      obj.t = 0;
      obj.mesh.position.copy(obj.start);
    });
    lastInteractionTime = time;
  }

  renderer.render(scene, camera);
}
animate();

// Handle resize
window.addEventListener("resize", () => {
  const width = container.clientWidth;
  const height = container.clientHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});