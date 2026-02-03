// Loader
window.onload = () => {
  document.getElementById("loader").style.display = "none";
}

// Dark mode
function toggleMode(){
  document.body.classList.toggle("dark");
}

// Reveal on scroll
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll(){
  const trigger = window.innerHeight * 0.8;
  reveals.forEach(r => {
    if(r.getBoundingClientRect().top < trigger){
      r.classList.add("show");
    }
  });
}
window.addEventListener("scroll", revealOnScroll);
revealOnScroll();
