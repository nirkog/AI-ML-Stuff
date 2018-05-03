const sides = document.querySelectorAll('.container div');
const button = document.querySelector('#trainBtn');
const guessDiv = document.querySelector('#guess');

let data = [];

let brain = new NeuralNetwork(3, 3, 1);

button.addEventListener('click', train);

sides.forEach(side => side.addEventListener('click', nextColor));

generateBackground();

function train() {
    guessDiv.textContent = 'The neural net is training';

    console.log('training');

    let trainingSum = 100000;
    for(let i = 0; i < trainingSum; i++) {
        let index = Math.floor(Math.random() * data.length);
        brain.train([data[index].r, data[index].g, data[index].b] , [data[index].output]);
    }

    console.log('done');

    guessDiv.textContent = 'The neural net is ready!';
}

function generateBackground() {
    const r = Math.random() * 255;
    const g = Math.random() * 255;
    const b = Math.random() * 255;

    for(let side of sides) {
        side.style.background = `rgb(${r}, ${g}, ${b})`;
    }
}

function conFunc(x) {
    return 4 * x * x - 4 * x + 1;
}

function nextColor(e) {
    let color = sides[0].style.background.substr(4, sides[0].style.background.length - 5).split(',');
    let r = parseInt(color[0]) / 255;
    let g = parseInt(color[1]) / 255;
    let b = parseInt(color[2]) / 255;

    data.push(
        {
            r: r,
            g: g,
            b: b,
            output: (e.target.className == 'right') ? 1 : 0
        }
    );

    generateBackground();

    color = sides[0].style.background.substr(4, sides[0].style.background.length - 5).split(',');
    r = parseInt(color[0]) / 255;
    g = parseInt(color[1]) / 255;
    b = parseInt(color[2]) / 255;

    let guess = brain.guess([r, g, b])[0];

    console.log(guess);
    guessDiv.textContent = `The neural net chose ${Math.round(guess) == 1 ? 'Black' : 'White'}`;//. It is ${(conFunc(guess) * 100).toFixed(2)}% confident.`;
}