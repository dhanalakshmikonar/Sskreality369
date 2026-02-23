let slides = document.querySelectorAll(".slide");
let current = 0;
let nextBtn = document.querySelector(".next");
let prevBtn = document.querySelector(".prev");
let dotsContainer = document.querySelector(".dots");

slides.forEach((_, index) => {
    let dot = document.createElement("span");
    dot.classList.add("dot");
    if(index === 0) dot.classList.add("active-dot");
    dotsContainer.appendChild(dot);
});

let dots = document.querySelectorAll(".dot");

function showSlide(index){
    slides.forEach(slide => slide.classList.remove("active"));
    dots.forEach(dot => dot.classList.remove("active-dot"));
    slides[index].classList.add("active");
    dots[index].classList.add("active-dot");
}

function nextSlide(){
    current = (current + 1) % slides.length;
    showSlide(current);
}

function prevSlide(){
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
}

nextBtn.onclick = nextSlide;
prevBtn.onclick = prevSlide;

dots.forEach((dot,index)=>{
    dot.addEventListener("click",()=>{
        current = index;
        showSlide(current);
    });
});

setInterval(nextSlide, 5000);