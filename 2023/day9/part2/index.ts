import fs from 'fs';

class Node {
    public value: string;
    public left: string;
    public right: string;
}

class SequenceNumber {
    private _sequences: number[][];

    constructor(inputs: string[]) {
        this._sequences = [];
        let data = inputs.map(x => Number(x));
        this._sequences.push(data);
        do {
            data = this._nextSequence(data);
            this._sequences.push(data);
        } while (!this._isAllZero(data));
    }

    public getNextNumber() {
        let lastAddingNumber = 0;
        for (let i = this._sequences.length - 1; i >= 0; i--) {
            const length = this._sequences[i].length;
            lastAddingNumber += this._sequences[i][length - 1];
            this._sequences[i].push(lastAddingNumber);
        }
        return lastAddingNumber;
    }

    public getPreviousNumber() {
        let lastSubNumber = 0;
        for (let i = this._sequences.length - 1; i >= 0; i--) {
            lastSubNumber = this._sequences[i][0] - lastSubNumber;
            this._sequences[i] = [ lastSubNumber, ...this._sequences[i]]
        }
        return lastSubNumber;
    }

    private _nextSequence(inputs: number[]) {
        let res: number[] = [];
        for (let i = 0; i < inputs.length - 1; i++) {
            res.push(inputs[i+1] - inputs[i]);
        }
        return res;
    }

    private _isAllZero(inputs: number[]) {
        return inputs.every(x => x === 0);
    }
}

function main() {
    let data = fs.readFileSync('input.txt', 'utf8');
    let lines = data.split('\n');
    console.log(lines.length);
    if (lines.length < 2) {
        throw new Error('Invalid input format');
    }

    let sum = 0;
    for (const line of lines) {
        const input = line.split(' ');
        const sequenceNumber = new SequenceNumber(input);
        const previousNumber = sequenceNumber.getPreviousNumber();
        sum += previousNumber;
        console.log(`sum = ${sum}, sequenceNumber = ${JSON.stringify(sequenceNumber)}`);
    }
}

main();