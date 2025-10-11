// داده‌های نظرات
const testimonials = [
    {
        name: " مریم احمدی ",
        role: "مدیر برند پگاه",
        text: " نوآوری در طراحی برند و استفاده از متریال مدرن برند توسط تیم زینو غرفه مارو به یکی از جذاب ترین غرفه های نمایشگاه تبدیل کرد",
    },
    {
        name: "حسین  رضایی ",
        role: "مدیر نمایشگاهی شرکت نفت  ",
        text: " طراحی منحصر به فرد و اجرای به موقع توسط تیم زینو تاثیر مستقیمی در موفقعیت و حضور ما در نمایشگاه نفت گاز داشت ",
    },
    {
        name: "سارا کریمی ",
        role: "مدیر روابط عمومی سامسونگ",
        text: "کیفیت کار و تعهد به زمان بندی از ویژگی های بارز تیم زینو است ما برای چندمین سال متوالی از خدمات زینو استفاده کردیم ",
    },

];

let currentIndex = 0;
const sliderContainer = document.getElementById("testimonial-slider");

// تابع برای رندر کردن نظرات
function renderTestimonials() {
    sliderContainer.innerHTML = "";
    const isMobile = window.innerWidth < 768;
    const itemsToShow = isMobile ? 2 : 1;

    for (let i = 0; i < itemsToShow; i++) {
        const itemIndex = (currentIndex + i) % testimonials.length;
        const t = testimonials[itemIndex];

        const testimonialDiv = document.createElement("div");
        testimonialDiv.classList.add("testimonial-item");
        testimonialDiv.setAttribute("data-aos", "fade-up");
        testimonialDiv.setAttribute("data-aos-delay", `${i * 100}`);
        testimonialDiv.innerHTML = `
        <div class="testimonial-name">${t.name}</div>
        <div class="testimonial-role">${t.role}</div>
        <div class="testimonial-stars">★★★★★</div>
        <div class="testimonial-text">${t.text}</div>
    `;
        sliderContainer.appendChild(testimonialDiv);
    }

    currentIndex = (currentIndex + itemsToShow) % testimonials.length;
}

// اجرای اولیه و حلقه خودکار
renderTestimonials();
setInterval(renderTestimonials, 20000); // تغییر به 20 ثانیه

// واکنش به تغییر سایز صفحه
window.addEventListener("resize", () => {
    currentIndex = 0;
    renderTestimonials();
});
