//GAME VARS
//sets rate at which game updates, higher number, faster the game will go
var FPS = 1000;
document.getElementById("game-speed").innerHTML = "Speed: 1000/ms";
function speed(t){
	if(t == "slow"){
		FPS -= 50;
		document.getElementById("game-speed").innerHTML = "Speed: " + FPS + "/ms";
	}
	else if(t == "fast"){
		FPS += 50;
		document.getElementById("game-speed").innerHTML = "Speed: " + FPS + "/ms";
	}
}
//
var spawnRate = 100;
var difficulty = 1;
var gameOver = false;
var score = 0;
//Neural net vars
var networkNum = 0;
document.getElementById("numNeural").innerHTML = networkNum + 1 + "/" + popNum;
//main game loop
var gameLoop = setInterval(function(){mainGameFunc()}, 1000/FPS);
//create function to detect if player is jumping and move accordingly
function detectJump(){
	if(p.jump == true){
		p.y -= p.v;
		p.v++;
		if(p.y <= 210){
			p.jump = false;
			p.v = 1;
		}
	}
	else{
		p.y += p.v;
		p.v+=4;
		if(p.y >= 360){
			p.y = 360;
			p.v = 0;
		}
	}
}
//collision detection
function detectCollide(){
	Boxes.forEach(function(b){
		if( p.x < b.x && p.x+p.width > b.x && p.y > 330 || 
			p.x > b.x && p.x+p.width < b.x+b.width && p.y > 330 ||
			p.x < b.x+b.width && p.x+p.width > b.x+b.width && p.y > 330){
			//if we are colliding, end the game
				gameOver = true;
				//save score to individual network
				//save score before resetting
				Brains[networkNum].score = score;
				//tell score of network to user
				//console.log("Final Score of [Network " + networkNum + "] was " + score + ", resetting game");
				//move to the next network for testing
				networkNum++;
				clearInterval(gameLoop);
				gameLoop = null;
				//check to see if there are still more networks to test, if so, save score, reset the game and start testing
				if(networkNum < Brains.length){
					document.getElementById("numNeural").innerHTML = networkNum + 1 + "/" + popNum;
					gameReset();
				}
				else{
					naturalSelection();
					networkNum = 0;
					document.getElementById("numNeural").innerHTML = networkNum + 1 + "/" + popNum;
					gameReset();
				}
		}
	});
}

//sensor detection
function sense(){
	var touchedBoxes = [];
	var touched = false;
	var count = 0;
	Boxes.forEach(function(b){
		if( sensor.x < b.x && sensor.x+sensor.width > b.x && sensor.y > 370 || 
			sensor.x > b.x && sensor.x+sensor.width < b.x+b.width && sensor.y > 370 ||
			sensor.x < b.x+b.width && sensor.x+sensor.width > b.x+b.width && sensor.y > 370 ){
				touchedBoxes.push(b);
				sensor.touch = true;
				touched = true;
				count++;
				if(touchedBoxes.length >= 2){
					sensor.gap = (touchedBoxes[0].x - touchedBoxes[1].x) /(-175); 
					touchedBoxes = [];
				}
				else{
					sensor.gap = 0;
				}
				sensor.distance = ((b.x-100) /100) * 1;
		}
		else{
			if(!touched){
				touchedBoxes = [];
				sensor.touch = false;
				sensor.distance = 0;
				sensor.gap = 0;
			}
		}
		//only log if we have info to log, longer runs will backlog and cause a lot of lag client side otherwise
		if(sensor.distance != 0 || count != 0 || sensor.gap != 0){
			//console.log(sensor.distance + " | " + count + " | " + sensor.gap);
		}
		
	});
}
//main GAME LOOP function, used to bring EVERYTHING TOGETHER
function mainGameFunc(){
	//handle player
	detectJump();
	//handle boxes
	Boxes.forEach(function(b){b.x-=10;});
	spawnBox(spawnRate);
	//detect collision
	detectCollide();
	//give neural netowrk sensing capabilities
	sense();
	//////////////////////////////////////////////////////////
	//NN tests, working with nodes and values for input
	Brains[networkNum].assignInputValue(Brains[networkNum].input_nodes[0], sensor.distance);
	Brains[networkNum].assignInputValue(Brains[networkNum].input_nodes[1], sensor.count);
	Brains[networkNum].assignInputValue(Brains[networkNum].input_nodes[2], sensor.gap);
	Brains[networkNum].assignInputValue(Brains[networkNum].input_nodes[3], p.y / 360);
	Brains[networkNum].calc_hidden_sums();
	Brains[networkNum].calc_output_sums();
	Brains[networkNum].decide();
	////////////////////////////////////////////////////////////

	//draw Frame
	dFrame();
	//handle game VARS and update game score
	difficulty++;
	score += 1;
	//increase spawnrate based on score, to make the game more challenging
	upDiff(score);
	//(score%200 == 0)?spawnRate -= 1:spawnRate=spawnRate;
	//display score to user
	document.getElementById('score-count').innerHTML = "Score: "+score;
}
//fucntion to reset the game for a new network to try
function gameReset(){
	//clear all existing boxes
	Boxes = [];
	//reset game vars
	spawnRate = 50;
	difficulty = 1;
	gameOver = false;
	score = 0;
	//console.log("Testing [Network " + networkNum + "]");
	gameLoop = setInterval(function(){mainGameFunc()}, 1000/FPS);
}

function upDiff(score){
	if(score%400 == 0){
		if(spawnRate > 30){
			spawnRate -= 2;
		}
		
	}
}