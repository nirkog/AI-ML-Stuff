class Spot {
    constructor(column, row) {
        this.row = row;
        this.column = column;

        this.f = 0;
        this.g = 0;
        this.h = 0;

        this.neighbors = [];

        this.parent = null;
        this.wall = false;
    }

    Draw(color) {
        ctx.fillStyle = color;
        ctx.fillRect(this.column * spotWidth, this.row * spotHeight, spotWidth, spotHeight);
        ctx.fillStyle = '#111';
        ctx.strokeRect(this.column * spotWidth, this.row * spotHeight, spotWidth, spotHeight);
    }

    AddNeighbors() {
        if(this.row > 0)
            this.neighbors.push(grid[this.column][this.row - 1]);
        if(this.column < columns - 1)
            this.neighbors.push(grid[this.column + 1][this.row]);
        if(this.row < rows - 1)
            this.neighbors.push(grid[this.column][this.row + 1]);
        if(this.column > 0)
            this.neighbors.push(grid[this.column - 1][this.row]);
    }
}

function generateGrid() {
    for(let i = 0; i < columns; i++) {
        grid[i] = new Array();
        for(let j = 0; j < rows; j++) {
            grid[i][j] = new Spot(i, j);

            if(Math.random() < 0.1) {
                grid[i][j].wall = true;
            }
        }
    }

    for(let i = 0; i < columns; i++) {
        for(let j = 0; j < rows; j++) {
            grid[i][j].AddNeighbors();
        }
    }
}

canvas = document.querySelector('#canvas');
ctx = canvas.getContext('2d');

requestAnimationFrame(draw);

let w = canvas.width;
let h = canvas.height;

let grid = new Array();

let rows = columns = 25;
let spotHeight = w / rows, spotWidth = h / columns, spotColor = '#fff';
let openSetColor = '#1d1', closedSetColor = '#d11';
let bgColor = '#fff', pathColor = '#4af', wallColor='#313';
let done = false;

let start, end;
let openSet = closedSet = [];

setup();

function distance(a, b) {
    return Math.abs(a.column - b.column) + Math.abs(a.row - b.row);
}

function getHeuristic(spot) {
    return distance(spot, end);
}

function drawPath(current) {
    path = [];
    tmp = current;
    path.push(tmp);
    while(tmp.parent != null) {
        path.push(tmp.parent);
        tmp = tmp.parent;
    }

    for(let i = 0; i < path.length; i++) {
        path[i].Draw(pathColor);
    }
}

function setup() {
    generateGrid();

    start = grid[0][0];
    end = grid[columns - 1][rows - 1];

    start.f = getHeuristic(start);
    openSet.push(start);
}

function draw() {
    ctx.fillStyle = bgColor; 
    ctx.fillRect(0, 0, w, h);
    let current = undefined;

    if(openSet.length > 0) {
        current = openSet[0];
        openSet.forEach((spot) => {
            if(spot.f < current.f) 
                current = spot;
        });

        if(current == end) {
            console.log('DONE!');
            done = true;
        }

        openSet.splice(openSet.indexOf(current), 1);
        closedSet.push(current);

        for(let i = 0; i < current.neighbors.length; i++) {
            let neighbor = current.neighbors[i];
            if(!closedSet.includes(neighbor) && !neighbor.wall) {
                let tempG = current.g + 1;
                if(openSet.includes(neighbor)) {
                    if(tempG < neighbor.g)
                        neighbor.g = tempG;
                } else {
                    neighbor.g = tempG;
                    openSet.push(neighbor);
                }

                neighbor.parent = current;
                neighbor.h = getHeuristic(neighbor);
                neighbor.f = neighbor.g + neighbor.h;
            }
        }

        //console.log(openSet.length);
    } else {
        console.log('no solution?');
        done = true;
    }

    for(let i = 0; i < columns; i++) {
        for(let j = 0; j < rows; j++) {
            if(grid[i][j].wall)
                grid[i][j].Draw(wallColor);
            else
                grid[i][j].Draw(spotColor);
        }
    }

    drawPath(current);

    if(!done) requestAnimationFrame(draw);
}