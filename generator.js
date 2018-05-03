//will be used to generate maps
function blankMap(mapW,mapH){
    var map = new Array((mapW))
    for (var x = 0; x < mapW; x++){
        map[x] = new Array(mapH)
        for(var y = 0; y < mapH; y++){
            if (x == 0 || y == 0 || x == mapW-1 || y == mapH-1) map[x][y] = 0
            else map[x][y] = 1
        }
    }
    return map
}