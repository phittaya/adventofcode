import fs from 'fs';

class Node {
    public value: string;
    public left: string;
    public right: string;
}

class NodeMatched {
    public count: number;
    public value: string;
    public index: number;
    public diff: number;
}

class LastCommonMultiple {
    public static calculate(inputs: number[]) {
        const sortedInputs = inputs.sort((a, b) => a - b);
        const max = sortedInputs[sortedInputs.length - 1];
        const maxCommonFactor = this._getMaxCommonFactor(sortedInputs, max);
        const dividedNumbers = sortedInputs.map(x => x / maxCommonFactor);
        let res = maxCommonFactor;
        for (const num of dividedNumbers) {
            res *= num;
        }
        return res;
    }

    private static _getMaxCommonFactor(data: number[], max: number) {
        for (let i = Math.ceil(max/2); i > 1; i--) {
            if (this._isCommonFactorNumber(i, data)) {
                console.log(`Max Common Factor Number = ${i}`);
                return i;
            }
        }
        return 1;
    }

    private static _isCommonFactorNumber(num: number, data: number[]) {
        return data.every(x => (x % num) === 0);
    }
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

    public resolves(instructions: string, isStart: (x: string) => boolean, isEnd: (x: string) => boolean) {
        let starts = Object.keys(this._maps).filter(x => isStart(x));
        let diff: number[] = [];
        for (const start of starts) {
            const match = this.match(instructions, start, isEnd);
            if (match.matchedIndex.length === 1 && match.matchedIndex[0].diff === match.count) {
                diff.push(match.matchedIndex[0].diff);
                console.log(`start = ${start}, match = ${JSON.stringify(match)}`);
            } else {
                throw new Error('Not implemented');
            }
        }
        return LastCommonMultiple.calculate(diff);
    }

    public match(instructions: string, start: string, isEnd: (x: string) => boolean) {
        let count = 0;
        let lastMatched = 0;
        const matchedIndex: NodeMatched[] = [];
        let node = this._maps[start];
        do {
            const direction = instructions[count % instructions.length];
            node = (direction === 'L') ? this._maps[node.left] : this._maps[node.right];
            count++;
            if (isEnd(node.value)) {
                if (matchedIndex.length > 0) {
                    const last = matchedIndex[matchedIndex.length - 1];
                    if (last.value === node.value
                        && last.index === count % instructions.length
                        && last.diff === count - lastMatched) {
                            console.log(`Repeated !!!`);
                            count = lastMatched;
                            break;
                        }
                }
                matchedIndex.push({
                    count: count,
                    value: node.value,
                    index: count % instructions.length,
                    diff: count - lastMatched
                });
                lastMatched = count;
            }
        } while (node.value !== start || (count % instructions.length) !== 0)
        return {
            count: count,
            matchedIndex: matchedIndex
        };
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
    const count = maps.resolves(instructions, (x => x.endsWith('A')), (x => x.endsWith('Z')));
    console.log(`count = ${count}, maps = ${JSON.stringify(maps, null, 2)}`);
}

main();