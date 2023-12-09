import fs from 'fs';

class Node {
    public value: string;
    public left: string;
    public right: string;
}

class MapNetwork {
    private _maps: {[key: string]: Node}

    constructor(inputs: string[]) {
        this._maps = {};
        for (const input of inputs) {
            if (input === '') {
                continue;
            }
            const data = this._parse(input);
            this._maps[data.value] = data;
        }
    }

    public resolve(instructions: string, start: string, end: string) {
        let count = 0;
        let node = this._maps[start];
        while (node.value !== end) {
            const direction = instructions[count % instructions.length];
            node = (direction === 'L') ? this._maps[node.left] : this._maps[node.right];
            count++;
        }
        return count;
    }

    private _parse(input: string) {
        const matched = Array.from(input.matchAll(/([^ =,()]+)/g), (x) => x[0]);
        if (matched.length !== 3) {
            throw new Error('Invalid input format');
        }
        return {
            value: matched[0],
            left: matched[1],
            right: matched[2]
        };
    }
}

function main() {
    let data = fs.readFileSync('input.txt', 'utf8');
    let lines = data.split('\n');
    console.log(lines.length);
    if (lines.length < 2) {
        throw new Error('Invalid input format');
    }

    const instructions = lines.shift() ?? '';
    const maps = new MapNetwork(lines);
    const count = maps.resolve(instructions, 'AAA', 'ZZZ');
    console.log(`count = ${count}, maps = ${JSON.stringify(maps, null, 2)}`);
}

main();