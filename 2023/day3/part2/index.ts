import fs from 'fs';

type NumberInfo = {
    startPost: number,
    length: number,
    value: string
};

function isNumberChar(c: string) {
    return (c >= '0' && c <= '9');
}

class Numbers {
    private _numbers: {[key: number]: NumberInfo[]};
    private _maxLineId: number;

    constructor(input: string[]) {
        this._numbers = {};
        this._maxLineId = input.length - 1;
        for (let i=0; i < input.length; i++) {
            this._numbers[i] = this._parseLine(input[i]);
        }
    }

    public getNumbers(lineId: number, index: number) {
        let res = [];
        const startLine = (lineId > 0) ? lineId - 1 : 0;
        const endLine = lineId + 1;
        for (let line = startLine; line <= endLine; line++) {
            for (let num of this._numbers[line]) {
                if (this._isAdjacent(index, num)) {
                    res.push(num);
                }
            }
        }
        return res;
    }

    public _isAdjacent(index: number, num: NumberInfo) {
        return (index >= num.startPost - 1 && index <= num.startPost + num.length);
    }

    private _parseLine(input: string) {
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
}

function parseGears(input: string) {
    let res = [];
    for (let i = 0; i < input.length; i++) {
        if (input[i] === '*') {
            res.push(i);
        }
    }
    return res;
}

function main() {
    var data = fs.readFileSync('input.txt', 'utf8');
    var lines = data.split('\n');
    console.log(lines.length);
    var numbers = new Numbers(lines);

    console.log(`numbers = ${JSON.stringify(numbers, null, 2)}`);

    let sum = 0;
    for (let lineId = 0; lineId < lines.length; lineId++) {
        const gears = parseGears(lines[lineId]);
        for (let gearPos of gears) {
            const numbersAroundGear = numbers.getNumbers(lineId, gearPos);
            if (numbersAroundGear.length === 2) {
                sum += Number(numbersAroundGear[0].value) * Number(numbersAroundGear[1].value);
            }
        }
        console.log(`sum = ${sum}, id = ${lineId}, string = ${JSON.stringify(gears)}`);
    }
}

main();