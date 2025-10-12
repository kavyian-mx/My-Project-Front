document.addEventListener("DOMContentLoaded", () => {
    const icons = document.querySelectorAll(".floating-icon");
    const container = document.getElementById("icons-container");
    const displayImage = document.getElementById("icon-display-image");

    let positions = [];
    let speeds = [];

    function initIcons() {
        const containerRect = container.getBoundingClientRect();
        positions = [];
        speeds = [];
        icons.forEach((icon, i) => {
            positions.push({
                x: Math.random() * (containerRect.width - 40),
                y: Math.random() * (containerRect.height - 40),
            });
            speeds.push({
                x: (Math.random() - 0.5) * 1.5,
                y: (Math.random() - 0.5) * 1.5,
            });
            icon.style.left = positions[i].x + "px";
            icon.style.top = positions[i].y + "px";
        });
    }

    function animateIcons() {
        const containerRect = container.getBoundingClientRect();
        icons.forEach((icon, i) => {
            positions[i].x += speeds[i].x;
            positions[i].y += speeds[i].y;

            if (
                positions[i].x <= 0 ||
                positions[i].x >= containerRect.width - 40
            ) {
                speeds[i].x *= -1;
            }
            if (
                positions[i].y <= 0 ||
                positions[i].y >= containerRect.height - 40
            ) {
                speeds[i].y *= -1;
            }

            icon.style.left = positions[i].x + "px";
            icon.style.top = positions[i].y + "px";
        });
        requestAnimationFrame(animateIcons);
    }

    // کلیک روی آیکون → تغییر عکس و رنگ
    icons.forEach((icon) => {
        icon.addEventListener("click", (e) => {
            e.stopPropagation();
            const imgSrc = icon.getAttribute("data-image");
            displayImage.src = imgSrc;

            // حذف active از همه و اضافه کردن به آیکون انتخابی
            icons.forEach((i) => i.classList.remove("active"));
            icon.classList.add("active");
        });
    });

    initIcons();
    animateIcons();
    window.addEventListener("resize", initIcons);
});
