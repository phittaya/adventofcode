import fs from 'fs';

enum Direction {
    North = 0,
    South,
    East,
    West,
    Stop
};

const Directions = [Direction.North, Direction.South, Direction.East, Direction.West];

interface Position {
    posX: number;
    posY: number;
}

class PipeDiagram {
    private _data: string[][];
    private _maxX: number;
    private _maxY: number;

    constructor(inputs: string[]) {
        this._data = [];
        for (const input of inputs) {
            this._data.push(input.split(''));
        }
        this._maxX = this._data[0].length;
        this._maxY = this._data.length;
    }

    public get routes() {
        const start = this._startPosition;
        if (start === null) {
            throw new Error('No start position');
        }

        let routes: Position[][] = [];
        for (const direction of Directions) {
            let route: Position[] = [];
            let next: {
                pos: Position;
                dir: Direction;
            } | null = { 
                dir: direction,
                pos: start
            };
            while (next !== null) {
                route.push(next.pos);
                next = this._nextPosition(next.dir, next.pos);
                if (next !== null) {
                    if (next.dir === Direction.Stop) {
                        break;
                    }
                } else {
                    route = []; // clear
                }
            }
            routes.push(route);
        }
        return routes;
    }

    private get _startPosition(): Position | null {
        for (let x = 0; x < this._maxX; x++) {
            for (let y = 0; y < this._maxY; y++) {
                if (this._data[y][x] === 'S') {
                    return {
                        posX: x,
                        posY: y
                    }
                } 
            }
        }
        return null;
    }

    private _nextPosition(dir: Direction, pos: Position): { pos :Position, dir: Direction } | null {
        let { posX, posY } = pos;
        switch (dir) {
            case Direction.North:
                posY -= 1;
                break;
            case Direction.South:
                posY += 1;
                break;
            case Direction.East:
                posX += 1;
                break;
            case Direction.West:
                posX -= 1;
                break;
            case null:
                posX = -1;
                posY = -1;
                break;
            default:
                throw new Error(`Invalid direction`);
        }

        if (!this._isValidPosition({ posX, posY })) {
            return null;
        }
        
        let nextDirection: Direction | null;
        switch (this._data[posY][posX]) {
            case '|':
                nextDirection = this._processPipeNorthSouth(dir);
                break;
            case '-':
                nextDirection = this._processPipeEastWest(dir);
                break;
            case 'L':
                nextDirection =  this._processPipeNorthEast(dir);
                break;
            case 'J':
                nextDirection = this._processPipeNorthWest(dir);
                break;
            case '7':
                nextDirection = this._processPipeSouthWest(dir);
                break;
            case 'F':
                nextDirection = this._processPipeSouthEast(dir);
                break;
            case '.':
                nextDirection = null;
                break;
            case 'S':
                nextDirection = Direction.Stop;
                break;
            default:
                throw new Error(`Invalid pipe symbol`);
        }

        if (nextDirection === null) {
            return null;
        }

        return {
            dir: nextDirection,
            pos: {
                posX,
                posY
            }
        };
    }

    private _isValidPosition(input: Position) {
        return (input.posX >= 0 && input.posX < this._maxX
            && input.posY >= 0 && input.posY < this._maxY)
    }

    private _processPipeNorthSouth(input: Direction): Direction | null {
        switch (input) {
            case Direction.North:
                return Direction.North;
            case Direction.South:
                return Direction.South;
            case Direction.East:
                return null;
            case Direction.West:
                return null;
            default:
                throw new Error(`Invalid direction`);
        }
    }

    private _processPipeEastWest(input: Direction): Direction | null {
        switch (input) {
            case Direction.North:
                return null;
            case Direction.South:
                return null;
            case Direction.East:
                return Direction.East;
            case Direction.West:
                return Direction.West;
            default:
                throw new Error(`Invalid direction`);
        }
    }

    private _processPipeNorthEast(input: Direction): Direction | null {
        switch (input) {
            case Direction.North:
                return null;
            case Direction.South:
                return Direction.East;
            case Direction.East:
                return null;
            case Direction.West:
                return Direction.North;
            default:
                throw new Error(`Invalid direction`);
        }
    }

    private _processPipeNorthWest(input: Direction): Direction | null {
        switch (input) {
            case Direction.North:
                return null;
            case Direction.South:
                return Direction.West;
            case Direction.East:
                return Direction.North;
            case Direction.West:
                return null;
            default:
                throw new Error(`Invalid direction`);
        }
    }

    private _processPipeSouthWest(input: Direction): Direction | null {
        switch (input) {
            case Direction.North:
                return Direction.West;
            case Direction.South:
                return null;
            case Direction.East:
                return Direction.South;
            case Direction.West:
                return null;
            default:
                throw new Error(`Invalid direction`);
        }
    }

    private _processPipeSouthEast(input: Direction): Direction | null {
        switch (input) {
            case Direction.North:
                return Direction.East;
            case Direction.South:
                return null;
            case Direction.East:
                return null;
            case Direction.West:
                return Direction.South;
            default:
                throw new Error(`Invalid direction`);
        }
    }
}

function main() {
    let data = fs.readFileSync('input.txt', 'utf8');
    let lines = data.split('\n');
    console.log(lines.length);

    const diagram = new PipeDiagram(lines);
    const routes = diagram.routes;
    let steps = Number.MAX_VALUE;
    for (const route of routes) {
        console.log(`length = ${route.length}, route = ${JSON.stringify(route)}`);
        if (route.length !== 0 && route.length < steps) {
            steps = route.length;
        }
    }
    console.log(`steps = ${steps / 2}`);
}

main();