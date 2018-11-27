const predictButton = document.getElementById("predictButton")
const modelSelector = document.getElementById("selectorButton")
const clearButton = document.getElementById("clearButton")

var modelName = "cnn"

var drawBoard;

var chart;
var first = false;


function Init(){
    canvasBoard.setAttribute("width",canvasOptions.width)
	canvasBoard.setAttribute("height",canvasOptions.height)
	canvasBoard.style.backgroundColor = canvasOptions.backgroundColor
	canvasBoard.style.width = canvasOptions.Width
	canvasBoard.style.height = canvasOptions.Height
}

predictButton.addEventListener('click',() => {
	modelName = modelSelector.options[modelSelector.selectedIndex].value;
	prediction()
})



async function prediction(){
    let model = await tf.loadModel("/output/"+modelName+"/model.json");
	
	let tensor = predictProcess(canvas,modelName)
    let predictions = await model.predict(tensor).data();

	let results = Array.from(predictions)

	console.log(results)
	
	if(!first){
		first = true;
		drawChart(results);
	}else{
		chart.clear();
		chart.destroy();
		drawChart(results)
	}	
}

/*
	დიაგრამის ხატვის ფუნქცია
*/
function drawChart(array){
	const ctx1 = document.getElementById("myChart").getContext('2d');

	chart = new Chart(ctx1, {
		type: 'bar',
		data: {
		  	labels: ["0", "1", "2", "3", "4","5","6","7","8","9"],
		  	datasets: [
				{
			  		label: "პროცენტულობა",
			  		backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850","#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
			  		data: array
				}
		  	]
		},
		options: { 
			responsive:false,
			maintainAspectRatio: false,
		 	legend: { 
				display: false 
			},
		  	title: {
				display: true,
				text: 'პროცენტულობა',
			},
		  	scales:{
				yAxes: [
					{
						display: true,
						ticks: {
							suggestedMin: 0,
						}
					}
				]
		  	}
		}
	});
}

/*
	ბიბლიოთეკის გამოყენება
*/

function predictProcess(image,modelname){
	let tensor;
	
	if(modelname == "mlp"){
		tensor = tf.fromPixels(image)
		    .resizeNearestNeighbor([28, 28])
		    .mean(2)
		    .toFloat()
			.reshape([1 , 784]);
	
	}else{
		tensor = tf.fromPixels(image)
			.resizeNearestNeighbor([28, 28])
			.mean(2)
			.expandDims(2)
			.expandDims()
			.toFloat();
	}

	return tensor.div(255.0);
}

Init()