const sides = document.querySelectorAll('.container div');
const data = [];

const button = document.querySelector('#printBtn');
button.addEventListener('click', () => console.log(data));

generateBackground();

for(let side of sides) {
    side.addEventListener('click', onClick);
}

function generateBackground() {
    const r = Math.random() * 255;
    const g = Math.random() * 255;
    const b = Math.random() * 255;

    for(let side of sides) {
        side.style.background = `rgb(${r}, ${g}, ${b})`;
    }
}

function onClick(e) {
    const color = sides[0].style.background.substr(4, sides[0].style.background.length - 5).split(',');
    const r = Number(color[0]);
    const g = Number(color[1]);
    const b = Number(color[2]);

    const obj = {
        r, g, b, output: (e.target.className == 'right') ? 1 : 0
    };

    data.push(obj);

    generateBackground();
}