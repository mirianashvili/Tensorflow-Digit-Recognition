const predictButton = document.getElementById("predictButton")
const canvasBoard = document.getElementById("canvas")

const canvasOptions = {
    width:200,
    Height:200,
    LineJoin:"round",
    LineWidth:3,
	StrokeStyle:"white",
	backgroundColor:"#000"
}

var drawBoard;

const ctx = canvas.getContext("2d");

var chart;

var first = false;

var clickX = new Array();
var clickY = new Array();
var clickD = new Array();

function Init(){
    canvasBoard.setAttribute("width",canvasOptions.width)
	canvasBoard.setAttribute("height",canvasOptions.height)
	canvasBoard.style.backgroundColor = canvasOptions.backgroundColor
	canvasBoard.style.width = canvasBoard.Width
	canvasBoard.style.height = canvasBoard.Height
}

predictButton.addEventListener('click',() => {
    prediction()
})

async function prediction(){
    let model = await tf.loadModel("/output/cnn/model.json");
	
	let tensor = predictProcess(canvas,"cnn")
    let predictions = await model.predict(tensor).data();

	
	let results = Array.from(predictions)
	//results = results.map((el)=>{console.log(el * 100);return 10*el ;})
  //  alert(results)
console.log(results)

var ctx1 = document.getElementById("myChart").getContext('2d');

if(!first){
	first = true;

chart = new Chart(ctx1, {
		type: 'bar',
		data: {
		  labels: ["0", "1", "2", "3", "4","5","6","7","8","9"],
		  datasets: [
			{
			  label: "პროცენტულობა",
			  backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850","#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
			  data: results
			}
		  ]
		},
		options: { 
			responsive:false,
			maintainAspectRatio: false,
		 	legend: { display: false },
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
							//suggestedMax:1,
							//stepSize: 0.1  // minimum value will be 0.
						}
					}
				]
		  	}
		}
	});
}else{
	chart.clear();
	chart.destroy();
	chart = new Chart(ctx1, {
		type: 'bar',
		data: {
		  labels: ["0", "1", "2", "3", "4","5","6","7","8","9"],
		  datasets: [
			{
			  label: "პროცენტულობა",
			  backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850","#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
			  data: results
			}
		  ]
		},
		options: { 
			responsive:false,
			maintainAspectRatio: false,
		 	legend: { display: false },
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
							//suggestedMax:1,
							//stepSize: 0.1  // minimum value will be 0.
						}
					}
				]
		  	}
		}
	});
}
	

	
}

$("#canvas").mousedown((e) => {
    const mouseX = e.pageX - this.offsetLeft
    const mouseY = e.pageY - this.offsetTop
   // drawing = true;
    drawBoard = true;
	addUserGesture(mouseX, mouseY);
	drawOnCanvas();
})

$("#canvas").mousemove(function(e) {
	if(drawBoard) {
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;
		addUserGesture(mouseX, mouseY, true);
        drawOnCanvas();
	}
});

$("#canvas").mouseup(function(e) {
	drawBoard = false;
});

canvas.addEventListener("touchstart", function (e) {
	if (e.target == canvas) {
    	e.preventDefault();
  	}

	var rect = canvas.getBoundingClientRect();
	var touch = e.touches[0];

	var mouseX = touch.clientX - rect.left;
	var mouseY = touch.clientY - rect.top;

	drawBoard = true;
	addUserGesture(mouseX, mouseY);
	drawOnCanvas();

}, false);

canvas.addEventListener("touchmove", function (e) {
	if (e.target == canvas) {
    	e.preventDefault();
  	}
	if(drawBoard) {
		var rect = canvas.getBoundingClientRect();
		var touch = e.touches[0];

		var mouseX = touch.clientX - rect.left;
		var mouseY = touch.clientY - rect.top;

		addUserGesture(mouseX, mouseY, true);
		drawOnCanvas();
	}
}, false);

function destroy(){
	if( chart !== undefined){
		console.log(chart)
		chart.clear();
	}

}

canvas.addEventListener("touchleave", function (e) {
	if (e.target == canvas) {
    	e.preventDefault();
  	}
	drawBoard = false;
}, false);

$("#canvas").mouseleave(function(e) {
	drawBoard = false;
});

canvas.addEventListener("touchend", function (e) {
	if (e.target == canvas) {
    	e.preventDefault();
  	}
	drawBoard = false;
}, false);

function drawOnCanvas() {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	ctx.strokeStyle = canvasOptions.StrokeStyle;
	ctx.lineJoin = canvasOptions.LineJoin;
	ctx.lineWidth = canvasOptions.LineWidth;

	for (var i = 0; i < clickX.length; i++) {
		ctx.beginPath();
		if(clickD[i] && i) {
			ctx.moveTo(clickX[i-1], clickY[i-1]);
		} else {
			ctx.moveTo(clickX[i]-1, clickY[i]);
		}
		ctx.lineTo(clickX[i], clickY[i]);
		ctx.closePath();
		ctx.stroke();
	}
}

function addUserGesture(x, y, dragging) {
	clickX.push(x);
	clickY.push(y);
	clickD.push(dragging);
}

function predictProcess(image,modelname){
	let tensor;
	
	if(modelname == "mlp"){
		tensor = tf.fromPixels(image)
		    .resizeNearestNeighbor([28, 28])
		    .mean(2)
		    .toFloat()
			.reshape([1 , 784]);
	
	}else{
   
	tensor =tf.fromPixels(image)
	.resizeNearestNeighbor([28, 28])
	.mean(2)
	.expandDims(2)
	.expandDims()
	.toFloat();
	}

	return tensor.div(255.0);
}

Init()