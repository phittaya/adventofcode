import fs from 'fs';

type Positions = { [key: number]: number[] };

function isNumberChar(c: string) {
    return (c >= '0' && c <= '9');
}

class Symbols {
    private _positions: Positions;
    private _maxLineId: number;

    constructor(input: string[]) {
        this._positions = {};
        this._maxLineId = input.length - 1;
        for (let i=0; i < input.length; i++) {
            this._positions[i] = this._parseLine(input[i]);
        }
    }

    public isAdjacent(lineId: number, index: number, length: number) {
        const startPos = (index > 0) ? index - 1 : 0;
        const endPos = index + length;
        const startLine = (lineId > 0) ? lineId - 1 : 0;
        const endLine = lineId + 1;
        for (let i = startLine; i <= endLine; i++) {
            if (i < 0 || i > this._maxLineId)
                continue;
            const position = this._positions[i];
            for (let j = 0; j < position.length; j++) {
                if (position[j] < startPos) {
                    continue;
                } else if (position[j] <= endPos) {
                    return true;
                } else {
                    break;
                }
            }
        }
        return false;
    }

    private _parseLine(input: string) {
        let res: number[] = [];
        for (let i = 0; i < input.length; i++) {
            if (input[i] !== '.' && isNumberChar(input[i]) !== true) {
                res.push(i);
            }
        }
        return res;
    }
}

function parseNumbers(input: string) {
    let res = [];
    let num = {
        startPost: 0,
        length: 0,
        value: ''
    };
    for (let i = 0; i < input.length; i++) {
        if (isNumberChar(input[i])) {
            if (num.length === 0) {
                num.startPost = i;
            }
            num.length += 1;
            num.value += input[i];
        } else {
            if (num.length !== 0) {
                res.push(num);
                num = {
                    startPost: 0,
                    length: 0,
                    value: ''                    
                }
            }
        }
    }
    if (num.length !== 0) {
        res.push(num);
    }
    return res;
}

function main() {
    var data = fs.readFileSync('input.txt', 'utf8');
    var lines = data.split('\n');
    console.log(lines.length);
    var synbols = new Symbols(lines);

    console.log(`synbols = ${JSON.stringify(synbols)}`);

    let sum = 0;
    for (let lineId = 0; lineId < lines.length; lineId++) {
        const numbers = parseNumbers(lines[lineId]);
        for (let i = 0; i < numbers.length; i++) {
            const number = numbers[i];
            if (synbols.isAdjacent(lineId, number.startPost, number.length)) {
                sum += Number(number.value);
            }
        }
        console.log(`sum = ${sum}, id = ${lineId}, string = ${JSON.stringify(numbers)}`);
    }
}

main();