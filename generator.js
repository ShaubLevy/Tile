//will be used to generate maps
function blankMap(mapW,mapH){
    var map = new Array((mapW*mapH))
    for (var x = 0; x < mapW; x++){
        for(var y = 0; y < mapH; y++){
            if (x == 0 || y == 0 || x == mapW-1 || y == mapH-1) map[(y*mapH)+x] = 0
            else map[(y*mapW)+x] = 1
        }
    }
    return map
}