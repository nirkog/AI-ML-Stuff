let canvas, ctx;
let w, h;
const cols = 15, rows = 15;
let grid;
let cellSize;
let current;

/*

WALLS ARE ORDERED:
TOP, RIGHT, BOTTOM, LEFT

*/

class Cell {
    constructor(cols, rows) {
        this.cols = cols;
        this.rows = rows;

        this.visited = false;

        this.walls = [true, true, true, true];
        this.parent = null;
    }

    draw() {
        ctx.strokeStyle = '#111';
        //ctx.strokeRect(this.cols * cellSize[0], this.rows * cellSize[1], cellSize[0], cellSize[1]);

        ctx.beginPath();

        if(this.walls[3]) {
            ctx.moveTo(this.cols * cellSize[0], this.rows * cellSize[1]);
            ctx.lineTo(this.cols * cellSize[0], this.rows * cellSize[1] + cellSize[1]);
        }
        if(this.walls[0]) {
            ctx.moveTo(this.cols * cellSize[0], this.rows * cellSize[1]);
            ctx.lineTo(this.cols * cellSize[0] + cellSize[0], this.rows * cellSize[1]);
        }
        if(this.walls[1]) {
            ctx.moveTo(this.cols * cellSize[0] + cellSize[0], this.rows * cellSize[1]);
            ctx.lineTo(this.cols * cellSize[0] + cellSize[0], this.rows * cellSize[1] + cellSize[1]);
        } if(this.walls[2]) {
            ctx.moveTo(this.cols * cellSize[0], this.rows * cellSize[1] + cellSize[1]);
            ctx.lineTo(this.cols * cellSize[0], this.rows * cellSize[1] + cellSize[1]);
        }
        ctx.stroke();


        if(current != this && !this.visited)
            ctx.fillStyle = '#29fb2f';
        else if(this.visited)
            ctx.fillStyle = '#20db10';
        ctx.fillRect(this.cols * cellSize[0], this.rows * cellSize[1], cellSize[0], cellSize[1]);
    }

    getUVNeighbors() {
        let neighbors = [];

        if(this.rows > 0)
            if(!grid[this.cols][this.rows - 1].visited) neighbors.push(grid[this.cols][this.rows - 1]);
        if(this.cols < cols - 1)
            if(!grid[this.cols + 1][this.rows].visited)neighbors.push(grid[this.cols + 1][this.rows]);
        if(this.rows < rows - 1)
            if(!grid[this.cols][this.rows + 1].visited)neighbors.push(grid[this.cols][this.rows + 1]);
        if(this.cols > 0)
            if(!grid[this.cols - 1][this.rows].visited)neighbors.push(grid[this.cols - 1][this.rows]);

        if(neighbors.length == 0)
            return null;

        return neighbors;
    }
}

function createGrid() {
    let grid = [];
    cellSize = [w / cols, h / rows];

    for(let i = 0; i < cols; i++) {
        grid.push([]);
        for(let j = 0; j < rows; j++) {
            grid[i].push(new Cell(i, j));
        }
    }

    return grid;
}

function setup() {
    canvas = document.querySelector('#canvas');
    ctx = canvas.getContext('2d');

    w = canvas.width;
    h = canvas.height;

    grid = createGrid();

    current = grid[0][0];

    requestAnimationFrame(draw);
}

function drawCells() {
    for(let i = 0; i < cols; i++) {
        for(let j = 0; j < rows; j++) {
            grid[i][j].draw();
        }
    }
}

function removeWalls(a, b) {
    if(b.cols == a.cols + 1) {
        a.walls[1] = false;
        b.walls[3] = false;
    } else if(b.cols == a.cols - 1) {
        a.walls[3] = false;
        b.walls[1] = false;
    } else if(b.rows == a.rows + 1) {
        a.walls[0] = false;
        b.walls[2] = false;
    } else if(b.rows == a.rows - 1) {
        a.walls[2] = false;
        b.walls[0] = false;
    }
}

function draw() {
    let done = false;

    let neighbors;
    if(current != null)
        neighbors = current.getUVNeighbors();
    else
        done = true;

    if(!done) {
        if(neighbors != null) {
            const randIndex = Math.floor(Math.random() * neighbors.length);
            const neighbor = neighbors[randIndex];
            removeWalls(current, neighbor);
            current.visited = true;
            neighbor.parent = current;
            current = neighbor;
        } else {
            current.visited = true;
            current = current.parent;
        }
    }

    drawCells();

    if(!done) requestAnimationFrame(draw);
    else console.log('DONE!');
}

setup();