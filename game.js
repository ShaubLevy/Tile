//instantiate the canvas and its context
var canvas = null
var ctx = null
//creating a temp map
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
//the pixel width and height of a single tile
var tileW = 40, tileH = 40;
//the tile width and height of the whole map
var mapW = 10, mapH = 10;
//variables used for framerate calculation
//currentSecond stores the current second for which the framerate will be counted: it updates to the next second when 1 full second has elapsed
//frameCount is used to show the number of frames per second: it increases by 1 each frame until a second has elapsed, then it resets to 1
//framesLastSecond stores the frameCount from the previous second to display
var currentSecond = 0, frameCount = 0, framesLastSecond = 0, lastFrameTime = 0;
//
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
    window.addEventListener("keydown", function(e) {
		if(e.keyCode>=37 && e.keyCode<=40) { keysDown[e.keyCode] = true; }
	});
	window.addEventListener("keyup", function(e) {
		if(e.keyCode>=37 && e.keyCode<=40) { keysDown[e.keyCode] = false; }
	});
}

function drawGame(){
    if (ctx == null) {return;}

    var currentFrameTime = Date.now()
    var timeElapsed = currentFrameTime - lastFrameTime;

    var sec = Math.floor(Date.now()/1000);
    if(sec!=currentSecond)
    {
        currentSecond = sec;
        framesLastSecond = frameCount;
        frameCount = 1;
    }
    else{frameCount++}

    if(!player.processMovement(currentFrameTime)){
        if(keysDown[38] && player.tileFrom[1]>0 && gameMap[toIndex(player.tileFrom[0], player.tileFrom[1]-1)]==1) { player.tileTo[1]-= 1; }
		else if(keysDown[40] && player.tileFrom[1]<(mapH-1) && gameMap[toIndex(player.tileFrom[0], player.tileFrom[1]+1)]==1) { player.tileTo[1]+= 1; }
		else if(keysDown[37] && player.tileFrom[0]>0 && gameMap[toIndex(player.tileFrom[0]-1, player.tileFrom[1])]==1) { player.tileTo[0]-= 1; }
        else if(keysDown[39] && player.tileFrom[0]<(mapW-1) && gameMap[toIndex(player.tileFrom[0]+1, player.tileFrom[1])]==1) { player.tileTo[0]+= 1; }
        
        if(player.tileFrom[0]!=player.tileTo[0] || player.tileFrom[1]!=player.tileTo[1])
		{ player.timeMoved = currentFrameTime; }
    }

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

    ctx.fillStyle = "#0000ff";
	ctx.fillRect(player.position[0], player.position[1],
		player.dimensions[0], player.dimensions[1]);

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
    this.delayMove = 250;
}

Character.prototype.placeAt = function(x,y){
    this.tileFrom = [x,y]
    this.tileTo = [x,y]
    this.position = [((tileW * x)+(tileW-this.dimensions[0])/2),
                ((tileH * y)+(tileH-this.dimensions[1])/2)]              
}

Character.prototype.processMovement = function(t){
    if(this.tileFrom[0]==this.tileTo[0] && this.tileFrom[1]==this.tileTo[1]) {return false}

    if((t-this.timeMoved) >= this.delayMove){
        this.placeAt(this.tileTo[0],this.tileTo[1])
    }
    else{
        this.position[0] = (this.tileFrom[0]*tileW) + ((tileW-this.dimensions[0])/2)
        this.position[1] = (this.tileFrom[1]*tileH) + ((tileH-this.dimensions[1])/2)

        if(this.tileTo[0] != this.tileFrom[0]){
            var diff = (tileW / this.delayMove) * (t-this.timeMoved)
            this.position[0] += (this.tileTo[0]<this.tileFrom[0] ? 0 - diff : diff)
        }
        if(this.tileTo[1] != this.tileFrom[1]){
            var diff = (tileH / this.delayMove) * (t-this.timeMoved)
            this.position[1] += (this.tileTo[1]<this.tileFrom[1] ? 0 - diff : diff)
        }
        this.position[0] = Math.round(this.position[0]);
		this.position[1] = Math.round(this.position[1]);
    }

    return true;
}

function toIndex(x,y){
    return((y*mapW)+x)
}