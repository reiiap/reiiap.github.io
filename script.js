const text = "Development Server & Chef";
let index = 0;
const speed = 100;
const element = document.querySelector(".typing");

function typeEffect() {
  if (index < text.length) {
    element.innerHTML += text.charAt(index);
    index++;
    setTimeout(typeEffect, speed);
  }
}

element.innerHTML = "";
typeEffect();
