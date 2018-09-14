var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var func = document.getElementById("function");

var treeid = document.getElementById("trees");
var lumberid = document.getElementById("lumbers");
var bearid = document.getElementById("bears");



var cwidth = canvas.width;
var cheight = canvas.height;
var firstTime = 1;

function initialiseMap(){
	ctx.fillStyle = "white";
	ctx.fillRect(0,0,cwidth,cheight);
	ctx.strokeStyle = "grey";
	for(var i=0; i<=cwidth; i+=40){
		ctx.beginPath();
		ctx.moveTo(i,0);
		ctx.lineTo(i,cheight);
		ctx.stroke();
	}
	for(var i=0; i<=cheight; i+=40){
		ctx.beginPath();
		ctx.moveTo(0,i);
		ctx.lineTo(cwidth,i);
		ctx.stroke();
	}
}

function randInt(min,max){
	return min+Math.floor(Math.random()*(max-min+1));
}

Array.prototype.select = function(func){
	var selectedArray = [];
  for(let i = 0; i < this.length; i++) {
    if (func(this[i])) selectedArray.push(this[i]);
  }
  return selectedArray;
}

initialiseMap();