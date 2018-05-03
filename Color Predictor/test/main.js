//const sides = document.querySelectorAll('.container div');
const main = document.querySelector('.main');
const guess = document.querySelector('#guess');
let current = 0;

let data = [];

getData();

document.addEventListener('click', nextColor);

function getData() {
    fetch('predictions.csv').then((response) => {
        return response.text();
    }).then((text) => {
        let rawData = [];
        let result = [];
        for(let line of text.split('\n')) {
            for(let num of line.split(',')) {
                rawData.push(Number(num));
            }
        }

        for(let i = 0; i < rawData.length / 4; i++) {
            const r = rawData[i * 4];
            const g = rawData[i * 4 + 1];
            const b = rawData[i * 4 + 2];
            const output = rawData[i * 4 + 3];
    
            result.push({r, g, b, output});
        }

        data = result;

        nextColor();
    });
}

function nextColor() {
    if(current < data.length) {
        main.style.background = `rgb(${data[current].r}, ${data[current].g}, ${data[current].b})`;
        const color = (data[current].output == 1) ? '#000' : '#fff';
        main.style.color = color;
        //guess.textContent = `The Neural Net picked ${color}`;
        current++;
    } else {
        guess.textContent = 'OUT OF DATA!';
    }
}