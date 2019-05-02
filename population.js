//set num of nodes for perceptron types
var numInput = 4;
var numHidden = 5;
var numOutput = 2;
//array to hold all created networks for testing
var Brains = [];
const popNum = 50;
var generation = 0;
//create n new networks and add them to the array for initial population
for(i=0;i<popNum;i++){
	var N = new NeuralNetwork(numInput,numHidden,numOutput);
	N.initialize_nodes([jump, fall]);
	Brains.push(N);
}

//sort fitnesses from highest to lowest and create new array with probabilities for higher performing networks
var fitnessArray = [];
function sortFitnesses(){
	Brains.sort(function(a,b){return b.score - a.score});
	var avgFitness = 0;
	Brains.forEach(function(b){avgFitness += b.score});
	avgFitness /= Brains.length;
	document.getElementById("stat-track").innerHTML += "<tr><td>" + generation + "</td><td>" + Brains[0].score + "</td><td>" + avgFitness + "</td></tr>";
}
//evolution
function naturalSelection(){
	//reset fitness array
	fitnessArray = [];
	//kill the lowest scoring networks
	sortFitnesses();
	Brains.splice((popNum/2) - 1, popNum/2);
	Brains.forEach(function(n, i){
		//add networks that survived to fitness array based on how well they did, the higher the score, the more we add
		//this gives a higher probability that they will be chosen to reproduce and pass on their weights
		if(i<=Brains.length * 0.05){
			for(j=0;j<16;j++){
				fitnessArray.push(n);
			}
		}
		else if(i<=Brains.length * 0.2 && i >Brains.length * 0.05){
			for(j=0;j<8;j++){
				fitnessArray.push(n);
			}
		}
		else if(i<=Brains.length * 0.6 && i >Brains.length * 0.2){
			for(j=0;j<4;j++){
				fitnessArray.push(n);
			}
		}
		else{
			for(j=0;j<2;j++){
				fitnessArray.push(n);
			}
		}
	});
	BirthNewNetworks();
	generation++;
}
//BABIES
function BirthNewNetworks(){
	do{
		var netA = fitnessArray[Math.floor(Math.random() * (Brains.length - 1))];
		var netB = fitnessArray[Math.floor(Math.random() * (Brains.length - 1))];
		var N = new NeuralNetwork(numInput,numHidden,numOutput);
		N.initialize_nodes([jump, fall]);
		//loop through and take either node weight values from dad or mom
		//each weight or threshold has a chance to mutate a gene, so that we are not stuck picking from one data set
		//this adds variablility to the equation, which helps speed up the process of finding a correct solution with the network
		//INPUT
			for(i=0;i<numInput;i++){
				//random decision ot take "gene" from parents
				//INPUT
				for(j=0;j<numHidden;j++){
					N.input_nodes[i].connections[j][1] = spliceGenes(netA.input_nodes[i].connections[j][1], netB.input_nodes[i].connections[j][1]);
				}
			}
				//HIDDEN
			for(i=0;i<numHidden;i++){
				//random decision ot take "gene" from parents
				for(j=0;j<numOutput;j++){
					N.hidden_nodes[i].connections[j][1] = spliceGenes(netA.hidden_nodes[i].connections[j][1], netB.hidden_nodes[i].connections[j][1]);
				}
			}
				//OUTPUT
			for(i=0;i<numOutput;i++){
				N.output_nodes[i].threshold = rcw();
			}
		Brains.push(N);
	}while(Brains.length < popNum);
}

//function to fix my genetic algorithm fine tuning ---------
function spliceGenes(netA, netB){
	var testLength = false;
	var newGene = '';
	//convert floats to a string so we can iterate through and alter
	var genesOne = netA+='';
	var genesTwo = netB+='';

	//test to see which string is shorter
	(genesOne.length < genesTwo.length)?testLength = genesOne:testLength=genesTwo;

		for(g=0;g<testLength.length;g++){
			//random decision ot take "gene" from parents
			if(Math.random() > .5){
				newGene += genesOne.charAt(g);
				if(Math.random() < 0.2 && genesOne.charAt(g) != "."){
						newGene += Math.floor(Math.random() * 9) + 1;
				}
			}
			else{
				newGene += genesTwo.charAt(g);
				if(Math.random() < 0.2 && genesTwo.charAt(g) != "."){
						newGene += Math.floor(Math.random() * 9) + 1;
				}
			}
		}
	newGene = parseFloat(newGene);
	return newGene;
}