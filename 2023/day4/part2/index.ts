import fs from 'fs';

class ScratchCard {
    private _id: number;
    private _winningNumbers: number[];
    private _yourNumbers: number[];
    private _points: number;
    private _matches: number;

    constructor(input: string) {
        this._parse(input);
    }

    public get id() {
        return this._id;
    }

    public get points() {
        return this._points;
    }

    public get matches() {
        return this._matches;
    }
    private _parse(input: string) {
        const parts = input.split(':');
        if (parts.length !== 2) {
            throw new Error('Invalid Card format');
        }

        this._id = this._parseCardId(parts[0]);

        const numberLists = parts[1].split('|');
        if (numberLists.length !== 2) {
            throw new Error('Invalid Card numbers format');
        }

        this._winningNumbers = this._parseCardNumbers(numberLists[0].trim());
        this._yourNumbers = this._parseCardNumbers(numberLists[1].trim());
        [ this._points, this._matches ] = this._calculatePoints(this._winningNumbers, this._yourNumbers);
    }

    private _parseCardId(input: string) {
        if (input.startsWith('Card ')) {
            return Number(input.substring('Card '.length));
        }
        throw new Error('Invalid CardId format');
    }

    private _parseCardNumbers(input: string) {
        return input.split(' ').filter((x) => x !== '').map(x => Number(x.trim())).sort((a, b) => a - b);
    }

    private _calculatePoints(winningNumbers: number[], yourNumbers: number[]) {
        let points = 0;
        let matches = 0;    
        let winningNumbersIndex = 0;
        let yourNumbersIndex = 0;

        while (winningNumbersIndex < winningNumbers.length && yourNumbersIndex < yourNumbers.length) {
            if (winningNumbers[winningNumbersIndex] === yourNumbers[yourNumbersIndex]) {
                matches += 1;
                points = (points === 0) ? 1 : points * 2;
                winningNumbersIndex += 1;
                yourNumbersIndex += 1;
            } else if (winningNumbers[winningNumbersIndex] < yourNumbers[yourNumbersIndex]) {
                winningNumbersIndex += 1;
            } else {
                yourNumbersIndex += 1;
            }
        }
        return [ points, matches ]
    }
}

function updateCardInstances(cardInstances: number[], index: number, matches: number) {
    for (let i = index + 1; i <= index + matches && i < cardInstances.length; i++ ) {
        cardInstances[i] += cardInstances[index];
    }
}

function main() {
    let data = fs.readFileSync('input.txt', 'utf8');
    let lines = data.split('\n');
    console.log(lines.length);

    let cardInstances = new Array(lines.length).fill(1);
    let sum = 0;
    for (let lineId = 0; lineId < lines.length; lineId++) {
        const card = new ScratchCard(lines[lineId]);
        updateCardInstances(cardInstances, lineId, card.matches);
        sum += cardInstances[lineId];
        console.log(`sum = ${sum}, id = ${card.id}, instance = ${cardInstances[lineId]}, matches = ${card.matches}, string = ${JSON.stringify(card)}`);
    }
}

main();