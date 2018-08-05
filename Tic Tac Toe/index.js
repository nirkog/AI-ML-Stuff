const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.clientWidth;
const HEIGHT = canvas.clientHeight;

const cellSize = {width: WIDTH / 3, height: HEIGHT / 3};

let gameState = [];
let turn = 'X';

document.onreadystatechange = setup;

function setup(e) {
    for(let i = 0; i < 9; i++) {
        gameState.push(undefined);
    }

    document.onreadystatechange = undefined;
    canvas.addEventListener('click', onClick);
    requestAnimationFrame(draw);
}

function update() {

}

function draw() {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    update();

    drawLines();
    drawBoard();

    requestAnimationFrame(draw);
}

function drawLines() {
    const padding = 15;
    const lineWidth = 4;
    ctx.fillStyle = '#fefefe';

    ctx.fillRect(cellSize.width - lineWidth / 2, padding, lineWidth, HEIGHT - padding * 2);
    ctx.fillRect((cellSize.width - lineWidth / 2) * 2, padding, lineWidth, HEIGHT - padding * 2);
    ctx.fillRect(padding, cellSize.height - lineWidth / 2, WIDTH - padding * 2, lineWidth);
    ctx.fillRect(padding, (cellSize.height - lineWidth / 2) * 2, WIDTH - padding * 2, lineWidth);
}

function drawBoard() {
    let index = 0;
    for(let cell of gameState) {
        if(cell != undefined) {
            let cellI = index % 3;
            let cellJ = Math.floor(index / 3);

            ctx.font = '150px Arial';
            ctx.fillText(cell, cellI * cellSize.width + cellSize.width / 2 - 55, cellJ * cellSize.height + cellSize.height / 2 + 50);
        }
        index++;
    }
}

function onClick(e) {
    const x = e.clientX, y = e.clientY;
    const cell = {x: Math.floor(x / cellSize.width), y: Math.floor(y / cellSize.height)};
    const index = cell.y * 3 + cell.x;

    if(gameState[index] == undefined) {
        gameState[index] = turn;

        if(turn == 'X') turn = 'O';
        else if(turn == 'O') turn = 'X';
    }

    const check = checkForWin();
    if(check) {
        gameState = [];

        for(let i = 0; i < 9; i++) {
            gameState.push(undefined);
        }
        console.log(check + ' Won!');
    }
}

function checkForWin() {
    for(let i = 0; i < 3; i++) {
        if(gameState[i * 3] == gameState[i * 3 + 1] && gameState[i * 3] == gameState[i * 3 + 2] && gameState[i * 3] != undefined) {
            return gameState[i];
        } else if(gameState[i] == gameState[i + 3] && gameState[i] == gameState[i + 6] && gameState[i] != undefined) {
            return gameState[i];
        }
    }

    if(gameState[0] == gameState[4] && gameState[0] == gameState[8] && gameState[0] != undefined) {
        return gameState[0];
    } else if(gameState[2] == gameState[4] && gameState[2] == gameState[6] && gameState[2] != undefined) {
        return gameState[0];
    }

    return false;
}