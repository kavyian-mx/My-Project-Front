(function () {
    const backgroundColor = 0xf2f5fc; // رنگ پس‌زمینه
    const logoColor = 0x003366;       // رنگ حروف
    const floatSpeed = 0.03;          // سرعت حرکت
    const floatHeight = 0.3;          // دامنه حرکت عمودی
    const waveWidth = 0.15;           // دامنه حرکت افقی

    function waitForThree() {
        if (typeof THREE === "undefined") {
            console.log("منتظر لود شدن Three.js...");
            setTimeout(waitForThree, 100);
            return;
        }
        console.log("Three.js لود شد ✅");
        initLogo("xino-logo");
        initLogo("xino-logo-offcanvas");
    }

    function initLogo(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.warn(`Canvas با id="${canvasId}" پیدا نشد!`);
            return;
        }

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(backgroundColor);

        const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
        camera.position.z = 6;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        // نور
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 5, 5);
        scene.add(light);
        scene.add(new THREE.AmbientLight(0xffffff, 0.5));

        const loader = new THREE.FontLoader();
        loader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", function (font) {
            const letters = [];
            const textMaterial = new THREE.MeshStandardMaterial({ color: logoColor, metalness: 0.3, roughness: 0.4 });

            // ساخت هر حرف جداگانه
            const chars = ["X", "I", "N", "O"];
            const spacing = 1.2; // فاصله بین حروف
            chars.forEach((char, index) => {
                const textGeometry = new THREE.TextGeometry(char, {
                    font: font,
                    size: 1,
                    height: 0.3,
                    bevelEnabled: true,
                    bevelThickness: 0.03,
                    bevelSize: 0.02,
                    bevelSegments: 5
                });
                const mesh = new THREE.Mesh(textGeometry, textMaterial);
                textGeometry.center();
                mesh.position.x = (index - (chars.length - 1) / 2) * spacing;
                scene.add(mesh);
                letters.push({ mesh, phase: index * 0.8 });
            });

            let time = 0;
            function animate() {
                requestAnimationFrame(animate);
                time += floatSpeed;
                letters.forEach((letter) => {
                    letter.mesh.position.y = Math.sin(time + letter.phase) * floatHeight;
                    letter.mesh.position.x += Math.sin(time * 0.5 + letter.phase) * waveWidth * 0.01;
                });
                renderer.render(scene, camera);
            }
            animate();
        });
    }

    waitForThree();
})();
