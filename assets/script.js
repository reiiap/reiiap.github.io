window.onload = () => {
  document.getElementById("loader").style.display="none";
  reveal();
}

function toggleMode(){
  document.body.classList.toggle("dark");
}

function reveal(){
  let items = document.querySelectorAll(".reveal");
  window.addEventListener("scroll", () => {
    items.forEach(el => {
      let top = el.getBoundingClientRect().top;
      if(top < window.innerHeight - 100){
        el.classList.add("active");
      }
    });
  });
}
