//initiallize canvas and set context
const ctx = document.getElementById("canvas").getContext("2d");
//create function to draw frame
function dFrame(){
	ctx.clearRect(0,0,1000,400);
	p.draw();
	sensor.draw();
	Boxes.forEach(function(b){b.draw();});
}
//function to draw things, arguments are x, y, width, height, color
function draw(x,y,w,h,c){
	ctx.fillStyle = c;
	ctx.fillRect(x,y,w,h);
}