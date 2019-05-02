//create player object
var p = {
	x: 50,
	y: 360,
	width: 10,
	height: 40,
	draw: function(){draw(this.x, this.y, this.width, this.height, "#0eaf10");},
	jump: false,
	v: 0
};
//handles player jumping, triggered by the press of the spacebar
document.addEventListener("keydown", function(e){ 
	//jump
	if(e.keyCode == 32 && !e.repeat && p.y == 360){
		p.jump = true;
		p.v = 10;
	}
	//fall
	else if(e.keyCode == 40 && !e.repeat && p.y != 360){
		p.jump = false;
		p.v = 10;
	}
});

//handles the networks ability to jump
var spacePress = new KeyboardEvent("keydown", {
    keyCode: 32
});
var downPress = new KeyboardEvent("keydown", {
    keyCode: 40
});
//triggers the player to fall faster than just jumping
var fall = function(){document.dispatchEvent(downPress);}
var jump = function(){document.dispatchEvent(spacePress);}
//this line of code is what triggers the player to jump, so the network can use this to simulate pressing the spacebar
	//--------document.dispatchEvent(spacePress);--------------
//create box object constructor, for making boxes with random properties easier
var Box = function(x){
	this.x = x;
	this.y = 370;
	this.height = 30;
	this.width = 20;
	this.draw = function(){draw(this.x, this.y, this.width, this.height, "#FF0000");};
}
//create array to hold all Boxes in play
var Boxes = [];
//spawn boxes based on difficulty and add them to box array
function spawnBox(rate){
	if(difficulty%rate == 0){
		var box = new Box(Math.floor(Math.random() * 1060) + 1030);
		Boxes.push(box);
	}
}
//neural network sensor, this will detect and give a value based on how far a block is away from the player object, as well as count how many blocks are detected
var sensor = {
	x: 55,
	y: 380,
	width: 175,
	height: 3,
	touch: false,
	draw: function(){
		var c;
		(this.touch)?c="#0000FF":c="#FF0000";
		draw(this.x, this.y, this.width, this.height, c);},
	distance: 0,
	gap: 0,
	count: 0
};