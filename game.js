//instantiate the canvas and its context
var canvas = null
var ctx = null

//the pixel width and height of a single tile
var tileW = 40, tileH = 40;
//the tile width and height of the whole map
var mapW = 20, mapH = 20;

var gameMap = new blankMap(mapW,mapH)

//variables used for framerate calculation
//currentSecond stores the current second for which the framerate will be counted: it updates to the next second when 1 full second has elapsed
//frameCount is used to show the number of frames per second: it increases by 1 each frame until a second has elapsed, then it resets to 1
//framesLastSecond stores the frameCount from the previous second to display
var currentSecond = 0, frameCount = 0, framesLastSecond = 0, lastFrameTime = 0;
//create a variable that holds keypress information
var keysDown = {
    37 : false,
    38 : false,
    39 : false,
    40 : false 
}

//create a character to be controlled by the player
var player = new Character();

//the initialisation function that runs on the window loading
window.onload = function(){
    //obtain the canvas from the html document
    canvas = document.getElementById('game')
    //set the width and height of the canvas to match the dimensions of the map
    canvas.width = tileW * mapW
    canvas.height = tileH * mapH
    //get the 2-dimensional canvas context
    ctx = canvas.getContext('2d');
    //begin the draw loop for the game
    this.requestAnimationFrame(drawGame);
    //set the canvas font
    ctx.font = 'bold 10pt sans-serif'
    //add event listeners for key press and release
    window.addEventListener("keydown", function(e) {
        //if the pressed key is one of the arrow keys, set the respective keyDown variable to be true
		if(e.keyCode>=37 && e.keyCode<=40) { keysDown[e.keyCode] = true; }
	});
	window.addEventListener("keyup", function(e) {
        //if the released key is one of the arrow keys, set the respective keyDown variable to be false
		if(e.keyCode>=37 && e.keyCode<=40) { keysDown[e.keyCode] = false; }
	});
}

//the draw loop for the game
function drawGame(){
    //return if the document does not contain a canvas, or canvas can not be found
    if (ctx == null) {return;}
    //set currentFrameTime to the current second
    var currentFrameTime = Date.now()
    //calculate time elapsed between the last and current frames
    var timeElapsed = currentFrameTime - lastFrameTime;
    //obatin the current second
    var sec = Math.floor(Date.now()/1000);
    //if the true current second is not equal to the currentSecond variable:
    if(sec!=currentSecond)                                                  //This means a second has elapsed
    {                                                                       //
        currentSecond = sec;                                                //set the currentSecond variable equal to the true current second
        framesLastSecond = frameCount;                                      //use the frameCount for the last second to set framesLastSecond equal to the number of frames in the last second
        frameCount = 1;                                                     //return frameCount to 1
    }                                                                       //
    else{frameCount++}                                              // OR the frameCount per second is increased by one until a second has elapsed


    //checking if player movement can be processed
    if(!player.processMovement(currentFrameTime)){
        if(keysDown[38] && player.tileFrom[1]>0 && toIndex(player.tileFrom[0], player.tileFrom[1]-1)==1) { player.tileTo[1]-= 1; }
		else if(keysDown[40] && player.tileFrom[1]<(mapH-1) && toIndex(player.tileFrom[0], player.tileFrom[1]+1)==1) { player.tileTo[1]+= 1; }
		else if(keysDown[37] && player.tileFrom[0]>0 && toIndex(player.tileFrom[0]-1, player.tileFrom[1])==1) { player.tileTo[0]-= 1; }
        else if(keysDown[39] && player.tileFrom[0]<(mapW-1) && toIndex(player.tileFrom[0]+1, player.tileFrom[1])==1) { player.tileTo[0]+= 1; }
        
        if(player.tileFrom[0]!=player.tileTo[0] || player.tileFrom[1]!=player.tileTo[1])
		{ player.timeMoved = currentFrameTime; }
    }

    for (var y = 0; y < mapH; y++){
        for (var x = 0; x < mapW; x++){
            switch(gameMap[x][y]){

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
    return(gameMap[x][y])
}