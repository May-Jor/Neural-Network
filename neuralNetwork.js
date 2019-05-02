//neural network constructor
function NeuralNetwork(i, h, o){
	this.fitness = 0;
	this.num_input_nodes = i;
	this.num_hidden_nodes = h;
	this.num_output_nodes = o;
	this.input_nodes = [];
	this.hidden_nodes = [];
	this.output_nodes = [];
	//input, hidden, and output node initialization, pass executiions for output nodes as an array
	this.initialize_nodes = function(execution){
		var i;
		var j;
		//create the amount of nodes specified
		//OUTPUT
		for(i=0; i<this.num_output_nodes; i++){
			var p = new neuron("output", null, execution[i]);
			p.name = "o" + i;
			this.output_nodes.push(p);
		}
		//HIDDEN
		for(i=0; i<this.num_hidden_nodes; i++){
			var connections = [];
			//create connections between hidden and output
			for(j=0; j<this.num_output_nodes; j++){
				connections.push([this.output_nodes[j], rcw()]);
			}
			var p = new neuron("hidden", connections);
			p.name = "h" + i;
			this.hidden_nodes.push(p);
		}
		//INPUT
		for(i=0; i<this.num_input_nodes; i++){
			var connections = [];
			//create connections between hidden and output
			for(j=0; j<this.num_hidden_nodes; j++){
				connections.push([this.hidden_nodes[j], rcw()]);
			}
			var p = new neuron("input", connections);
			p.name = "i" + i;
			this.input_nodes.push(p);
		}
	}
	//function to calc all sums for Hidden layer perceptrons and save the values
	this.calc_hidden_sums = function(){
		//create variable to access input nodes due to conflictions with forEach
		var input_nodes = this.input_nodes;

		this.hidden_nodes.forEach(function(h){
			h.sum = 0;
			for(i=0;i<input_nodes.length;i++){
				for(j=0;j<input_nodes[i].connections.length;j++){
					if(input_nodes[i].connections[j][0].name == h.name){
						h.sum += (input_nodes[i].connections[j][1] * input_nodes[i].value);
					}
				}
			}
		});
	}
	//function to calc all sums for Output layer perceptrons and save the values
	this.calc_output_sums = function(){
		//create variable to access hidden nodes due to conflictions with forEach
		var hidden_nodes = this.hidden_nodes;

		this.output_nodes.forEach(function(h){
			h.sum = 0;
			for(i=0;i<hidden_nodes.length;i++){
				for(j=0;j<hidden_nodes[i].connections.length;j++){
					if(hidden_nodes[i].connections[j][0].name == h.name){
						h.sum += (hidden_nodes[i].connections[j][1] * hidden_nodes[i].sum);
					}
				}
			}
		});
	}
	//ASSIGN VALUES FOR INPUT PERCEPTRONS
	this.assignInputValue = function(input_node, value){
		input_node.value = value;
	}
	//make a decision based on network weights and initial values
	this.decide = function(){
		this.output_nodes.forEach(function(o){
			if(o.sum > o.threshold){
				o.execution();
			}
			else{
			}
		});
	}
}
//perceptron constructor, connections = multidimensional array
/* input -> hidden -> output
// Example data set
//   type="hidden"
//   [[NN.output_nodes[0], -0.8], [output_nodes[1], 0.5]]
//   execution is the code to be executed when the neural network reaches a decision
*/
function neuron(type, connections, execution){
	this.name;
	this.type = type;
	this.connections = connections;
	if(type == "output"){
		//assign output node specific properties
		this.threshold = Math.random();
		this.sum = 0;
		this.execution = execution;
	}
	else if(type == "hidden"){
		//assign hidden node specific properties
		this.sum = 0;
	}
	else{
		//assign input node specific properties
		this.value = 0;
	}

}
//function to get a random connection weight -- rcw = random connection weight -- 
function rcw(){
	if(Math.random() < .5){
	 return Math.random() * -1;
	}
	else{
		return Math.random();
	}
}