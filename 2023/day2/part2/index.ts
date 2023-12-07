import fs from 'fs';
const max_cubes = {
    'red': 12,
    'green': 13,
    'blue': 14
};

class CubeColor {
    public red: number;
    public green: number;
    public blue: number;

    constructor() {
        this.red = 0;
        this.green = 0;
        this.blue = 0;
    }
}

class GameCube {
    private _id: number;
    private _sets: CubeColor[];
    private _max: CubeColor;

    constructor(input: string) {
        const parts = input.split(':');
        this._id = this._parseGameId(parts[0]);
        this._sets = [];
        this._max = new CubeColor();
        const sets = parts[1].split(';');
        for (let i = 0; i< sets.length; i++) {
            const gameSet = this._parseGameSet(sets[i]);
            this._sets.push(gameSet);
            if (this._max.blue < gameSet.blue) {
                this._max.blue = gameSet.blue;
            }
            if (this._max.green < gameSet.green) {
                this._max.green = gameSet.green;
            }
            if (this._max.red < gameSet.red) {
                this._max.red = gameSet.red;
            }
        }
    }

    private _parseGameId(input: string) {
        if (input.startsWith('Game ')) {
            return Number(input.substring('Game '.length));
        }
        throw new Error('Invalid Game number format');
    }

    private _parseGameSet(input: string) {
        let res = new CubeColor();
        const colors = input.split(',');
        for (let i = 0; i < colors.length; i++) {
            const parts = colors[i].trim().split(' ');
            if (parts.length !== 2) {
                throw new Error('Invalid cube color format');
            }
            switch (parts[1]) {
                case 'red':
                    res.red = Number(parts[0]);
                    break;
                case 'green':
                    res.green = Number(parts[0]);
                    break;
                case 'blue':
                    res.blue = Number(parts[0]);
                    break;
            }
        }
        return res;
    }

    public get id() {
        return this._id;
    }

    public validate(red: number, green: number, blue: number) {
        for (let i = 0; i < this._sets.length; i++) {
            if (this._sets[i].red > red) {
                return false;
            }
            if (this._sets[i].green > green) {
                return false;
            }
            if (this._sets[i].blue > blue) {
                return false;
            }
        }
        return true;
    }

    public multipliedMaxColor() {
        return this._max.blue * this._max.green * this._max.red;
    }
}

function main() {
    var data = fs.readFileSync('input.txt', 'utf8');
    var lines = data.split('\n');
    console.log(lines.length);
    let sum = 0;
    for (const line of lines) {
        const game = new GameCube(line);
        sum += game.multipliedMaxColor();
        console.log(`sum = ${sum}, id = ${game.id}, string = ${JSON.stringify(game)}`);
    }
}

main();