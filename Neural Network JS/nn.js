class Matrix {
    constructor(a, b) {
        if(typeof(a) == 'number') {
            this.rows = a;
            this.columns = b;
            this.data = [];

            for(let i = 0; i < this.rows; i++) {
                this.data.push([]);
                for(let j = 0; j < this.columns; j++) {
                    this.data[i].push(0);
                }
            }
        } else if(a instanceof Array) {
            this.rows = a.length;
            this.columns = a[0].length;
            this.data = a;
        }
    }

    At(i, j) {
        return this.data[i][j];
    }

    SetAt(i, j, val) {
        this.data[i][j] = val;
    }

    Add(other) {
        if(typeof(other) == 'number') {
            this.data = this.data.map(
                row => row.map(val => val + other)
            );

            return this;
        } else if(other instanceof Matrix) {
            this.data = this.data.map(
                (row, i) => row.map((val, j) => val + other.At(i, j))
            );

            return this;
        }
    }

    static Add(a, b) {
        if(typeof(b) == 'number') {
            let m = new Matrix(a.rows, a.columns);
            m.data = a.data.map(
                row => row.map(val => val + b)
            );

            return m;
        } else if(b instanceof Matrix) {
            let m = new Matrix(a.rows, a.columns);
            m.data = a.data.map(
                (row, i) => row.map((val, j) => val + b.At(i, j))
            );

            return m;
        }
    }

    Substract(other) {
        if(typeof(b) == 'number') {
            this.Add(-b);
        } else if(b instanceof Matrix) {
            this.Add(Matrix.Multiply(b, -1));
        }
    }

    static Substract(a, b) {
        if(typeof(b) == 'number') {
            return Matrix.Add(a, -b);
        } else if(b instanceof Matrix) {
            return Matrix.Add(a, Matrix.Multiply(b, -1));
        }
    }

    Multiply(other) {
        if(typeof(other) == 'number') {
            this.data = this.data.map(
                row => row.map(val => val * other)
            );

            return this;
        } else if(other instanceof Matrix) {
            if(this.columns == other.rows) {
                let m = new Matrix(this.rows, other.columns);
                for(let i = 0; i < this.rows; i++) {
                    for(let j = 0; j < other.columns; j++) {
                        let item = 0;
                        for(let k = 0; k < this.columns; k++) {
                            item += this.data[i][k] * other.At(k, j);
                        }
                        m.SetAt(i, j, item);
                    }
                }

                this.data = m.data;
                this.columns = m.columns;

                return this;
            }

            throw new Error('Matrices\' sizes dont match');
        }
    }

    static Multiply(a, b) {
        if(typeof(b) == 'number') {
            let m = new Matrix(a.rows, a.columns);
            m.data = a.data.map(
                row => row.map(val => val * b)
            );

            return m;
        } else if(b instanceof Matrix) {
            if(a.columns == b.rows) {
                let m = new Matrix(a.rows, b.columns);
                for(let i = 0; i < a.rows; i++) {
                    for(let j = 0; j < b.columns; j++) {
                        let item = 0;
                        for(let k = 0; k < a.columns; k++) {
                            item += a.At(i, k) * b.At(k, j);
                        }
                        m.SetAt(i, j, item);
                    }
                }

                return m;
            }

            throw new Error('Matrices\' sizes dont match');
        }
    }

    HadamardMul(other) {
        if(this.rows == other.rows && this.columns == other.columns) {
            this.data = this.data.map(
                (row, i) => row.map((val, j) => val * other.At(i, j))
            );

            return this;
        }

        throw new Error('Matrices\' sizes dont match');
    }

    static HadamardMul(a, b) {
        if(a.rows == b.rows && a.columns == b.columns) {
            let m = new Matrix(a.rows, a.columns);
            m.data = a.data.map(
                (row, i) => row.map((val, j) => val * b.At(i, j))
            );

            return m;
        }

        throw new Error('Matrices\' sizes dont match');
    }

    Randomize() {
        this.data = this.data.map(
            row => row.map(val => Math.random() * 2 - 1)
        );

        return this;
    }

    Map(func) {
        this.data = this.data.map(
            (row, i) => row.map((val, j) => func(val, i, j))
        );

        return this;
    }

    static Map(m, func) {
        let ret = new Matrix(m.rows, m.columns);
        ret.data = m.data.map(
            (row, i) => row.map((val, j) => func(val, i, j))
        );

        return ret;
    }

    Transpose() {
        let newData = [];
        for(let i = 0; i < this.columns; i++) {
            newData.push([]);
            for(let j = 0; j < this.rows; j++) {
                newData[i].push(this.data[j][i]);
            }
        }

        this.data = newData;
        this.columns = this.rows;
        this.rows = this.data.length;

        return this;
    }

    static Transpose(m) {
        let ret = new Matrix(m.rows, m.columns);
        ret.data = m.data;
        ret.Transpose();

        return ret;
    }

    static fromArray(arr) {
        let m = new Matrix(arr.length, arr[0].length);
        m.data = arr;
        return m;
    }

    ToArray() {
        return this.data;
    }
}

class NeuralNetwork {
    constructor(inputs, hidden, outputs) {
        this.inputs = inputs;
        this.outputs = outputs;
        this.hidden = hidden;

        this.hiddenWeights = new Matrix(hidden, inputs);
        this.outputWeights = new Matrix(outputs, hidden);
        this.hiddenBias = new Matrix(hidden, 1);
        this.outputBias = new Matrix(outputs, 1);

        this.hiddenWeights.Randomize();
        this.outputWeights.Randomize();
        this.hiddenBias.Randomize();
        this.outputBias.Randomize();

        this.learningRate = 0.08;

        this.dActivate = this.dActivate.bind(this);
    }

    activate(x) {
        return 1 / (1 + Math.exp(-x));
    }

    dActivate(x) {
        return this.activate(x) * (1 - this.activate(x))
    }

    guess(inputs, ret) {
        inputs = Matrix.fromArray([inputs]);
        inputs.Transpose();
            
        let hiddenZ = Matrix.Multiply(this.hiddenWeights, inputs).Add(this.hiddenBias);
        let hidden = Matrix.Map(hiddenZ, (val, i, j) => 1 / (1 + Math.exp(-val)));

        let outputZ = Matrix.Multiply(this.outputWeights, hidden).Add(this.outputBias);
        let output = Matrix.Map(outputZ, this.activate);

        if(!ret)
            return output.ToArray()[0];
        else 
            return {inputs, hiddenZ, hidden, outputZ, output}
    }

    train(inputs, targets) {
        let data = this.guess(inputs, true);
        targets = new Matrix([targets]).Transpose();
        inputs = data.inputs;
        let hiddenZ = data.hiddenZ;
        let hidden = data.hidden;
        let outputZ = data.outputZ;
        let output = data.output;
        let dCost = Matrix.Substract(output, targets).Multiply(2);

        let dSigOutput = Matrix.Map(outputZ, this.dActivate);
        let hiddenT = Matrix.Transpose(hidden);
        let deltaWO = Matrix.HadamardMul(dSigOutput, dCost).Multiply(hiddenT).Multiply(-this.learningRate);
        let deltaBO = Matrix.HadamardMul(dSigOutput, dCost).Multiply(-this.learningRate);

        this.outputWeights.Add(deltaWO);
        this.outputBias.Add(deltaBO);

        let dSigHidden = Matrix.Map(hiddenZ, this.dActivate);
        let outputWT = Matrix.Transpose(this.outputWeights);
        let dCdH = Matrix.Multiply(outputWT, Matrix.HadamardMul(dSigOutput, dCost))
        let inputT = Matrix.Transpose(inputs);
        let deltaWH = Matrix.HadamardMul(dCdH, dSigHidden).Multiply(inputT).Multiply(-this.learningRate);
        let deltaBH = Matrix.HadamardMul(dCdH, dSigHidden).Multiply(-this.learningRate);

        this.hiddenWeights.Add(deltaWH);
        this.hiddenBias.Add(deltaBH);
    }
}