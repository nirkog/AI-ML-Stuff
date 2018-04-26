const sides = document.querySelectorAll('.container div');
const guess = document.querySelector('#guess');
let current = 0;

/* const rawData = [
    121, 94, 216, 0,
    215, 86, 165, 0,
    43, 67, 126, 0,
    60, 55, 163, 0,
    231, 34, 239, 0,
    215, 70, 178, 0,
    72, 117, 30, 0,
    37, 222, 92, 1,
    25, 30, 93, 0,
    63, 145, 172, 1,
    172, 158, 195, 1,
    106, 176, 72, 1,
    113, 17, 162, 0,
    209, 134, 76, 0,
    193, 50, 129, 0,
    12, 128, 222, 1,
    32, 31, 197, 0,
    152, 53, 101, 0,
    134, 84, 251, 0,
    87, 63, 84, 0,
    240, 53, 150, 0,
    250, 124, 157, 1,
    176, 88, 99, 0,
    212, 121, 1, 0,
    107, 139, 116, 0,
    52, 6, 98, 0,
    71, 208, 133, 1,
    254, 173, 54, 1,
    179, 234, 231, 1,
    126, 41, 22, 0,
    99, 45, 108, 0,
    52, 185, 216, 1,
    30, 200, 174, 1,
    198, 48, 37, 0,
    88, 29, 137, 0,
    33, 21, 146, 0,
    250, 209, 126, 1,
    68, 245, 18, 1,
    249, 160, 225, 1,
    28, 15, 248, 0,
    130, 245, 53, 1,
    197, 79, 9, 0,
    52, 33, 46, 0,
    160, 200, 123, 1,
    100, 156, 171, 1,
    24, 71, 29, 0,
    179, 94, 112, 0,
    110, 38, 118, 0,
    247, 5, 234, 0,
    82, 144, 201, 1]; */

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
        for(let side of sides) {
            side.style.background = `rgb(${data[current].r}, ${data[current].g}, ${data[current].b})`;
        }
        const color = (data[current].output == 1) ? 'BLACK' : 'WHITE';
        guess.textContent = `The Neural Net picked ${color}`;
        current++;
    } else {
        guess.textContent = 'OUT OF DATA!';
    }
}