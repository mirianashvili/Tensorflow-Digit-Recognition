var drawBoard;
const canvasBoard = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const canvasOptions = {
    width:200,
    Height:200,
    LineJoin:"round",
    LineWidth:3,
	StrokeStyle:"white",
	backgroundColor:"#000"
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
