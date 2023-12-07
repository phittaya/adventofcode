import fs from 'fs';
const max_cubes = {
    'red': 12,
    'green': 13,
    'blue': 14
};

class GameCube {
    private _id: number;
    private _sets: {[key: string]: number}[];

    constructor(input: string) {
        const parts = input.split(':');
        this._id = this._parseGameId(parts[0]);
        this._sets = [];
        const sets = parts[1].split(';');
        for (let i = 0; i< sets.length; i++) {
            this._sets.push(this._parseGameSet(sets[i]));
        }
    }

    private _parseGameId(input: string) {
        if (input.startsWith('Game ')) {
            return Number(input.substring('Game '.length));
        }
        throw new Error('Invalid Game number format');
    }

    private _parseGameSet(input: string) {
        let res: {[key: string]: number} = {};
        const colors = input.split(',');
        for (let i = 0; i < colors.length; i++) {
            const parts = colors[i].trim().split(' ');
            if (parts.length !== 2) {
                throw new Error('Invalid cube color format');
            }
            res[parts[1]] = Number(parts[0]);
        }
        return res;
    }

    public get id() {
        return this._id;
    }

    public validate(red: number, green: number, blue: number) {
        for (let i = 0; i < this._sets.length; i++) {
            if (this._sets[i]['red'] !== undefined && this._sets[i]['red'] > red) {
                return false;
            }
            if (this._sets[i]['green'] !== undefined && this._sets[i]['green'] > green) {
                return false;
            }
            if (this._sets[i]['blue'] !== undefined && this._sets[i]['blue'] > blue) {
                return false;
            }
        }
        return true;
    }
}

function main() {
    var data = fs.readFileSync('input.txt', 'utf8');
    var lines = data.split('\n');
    console.log(lines.length);
    let sum = 0;
    for (const line of lines) {
        const game = new GameCube(line);
        if (game.validate(12, 13, 14)) {
            sum += game.id;
        }
        console.log(`sum = ${sum}, id = ${game.id}, string = ${JSON.stringify(game)}`);
    }
}

main();