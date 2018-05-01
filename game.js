var canvas = null
var ctx = null
var gameMap = [
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 1, 1, 1, 0, 1, 1, 1, 1, 0,
	0, 1, 0, 0, 0, 1, 0, 0, 0, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 0, 1, 0, 0, 0, 1, 1, 0,
	0, 1, 0, 1, 0, 1, 0, 0, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 0, 0, 0, 0, 0, 1, 0, 0,
	0, 1, 1, 1, 0, 1, 1, 1, 1, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];
var tileW = 40, tileH = 40;
var mapW = 10, mapH = 10;

var currentSecond = 0, frameCount = 0, framesLastSecond = 0;

var keysDown = {
    37 : false,
    38 : false,
    39 : false,
    40 : false 
}

var player = new Character();

window.onload = function(){
    canvas = document.getElementById('game')
    canvas.width = tileW * mapW
    canvas.height = tileH * mapH
    ctx = canvas.getContext('2d');
    this.requestAnimationFrame(drawGame);
    ctx.font = 'bold 10pt sans-serif'
}

function drawGame(){
    if (ctx == null) {return;}

    var sec = Math.floor(Date.now()/1000);
    if(sec!=currentSecond)
    {
        currentSecond = sec;
        framesLastSecond = frameCount;
        frameCount = 1;
    }
    else{frameCount++}

    for (var y = 0; y < mapH; y++){
        for (var x = 0; x < mapW; x++){
            switch(gameMap[((y*mapW)+x)]){

                case 0:
                    ctx.fillStyle = '#000000'
                    break;
                default:
                    ctx.fillStyle = '#ccffcc'
            }
            ctx.fillRect(x*tileW,y*tileH,tileW,tileH);
        }
    }

    ctx.fillStyle = '#ff0000'
    ctx.fillText('FPS: ' + framesLastSecond, 10, 20)

    requestAnimationFrame(drawGame);
}

function Character(){
    this.tileFrom = [1,1]
    this.tileTo = [1,1]
    this.timeMoved = 0
    this.dimensions = [30,30]
    this.position = [45,45]
    this.delayMove = 700;
}