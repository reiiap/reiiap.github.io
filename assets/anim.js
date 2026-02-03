const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let t = 0;

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  for(let i=0;i<5;i++){
    ctx.beginPath();
    for(let x=0;x<canvas.width;x+=20){
      let y = Math.sin((x+t)/100 + i)*20 + canvas.height/2 + i*40;
      ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
  t+=2;
  requestAnimationFrame(draw);
}
draw();
