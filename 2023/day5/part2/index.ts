import fs from 'fs';

class NumRange {
    start: number;
    range: number;
}

class MapData {
    source: number;
    destination: number;
    range: number;
}
class Mapper {
    private _maps: MapData[];

    constructor(input: string[]) {
        this._maps = [];
        for (const line of input) {
            this._maps.push(this._parse(line));
        }
        this._maps.sort((a, b) => a.source - b.source);
    }

    public convert(input: number) {
        for (const map of this._maps) {
            if (input < map.source) {
                return input;
            } else if (input <  map.source + map.range) {
                return map.destination + (input - map.source);
            }
        }
        return input;
    }

    public convertNumRange(inputs: NumRange[]) {
        let res: NumRange[] = [];
        for (const input of inputs) {
            res.push(...this._convertNumRange(input));
        }
        res.sort((a, b) => a.start - b.start);
        return res;
    }

    private _parse(input: string) {
        const parts = input.split(' ').filter((x) => x !== '').map(x => Number(x.trim()));
        if (parts.length !== 3) {
            throw new Error('Invalid map data format');
        }
        return {
            destination: parts[0],
            source: parts[1],
            range: parts[2]
        }
    }

    private _convertNumRange(input: NumRange) {
        let res: NumRange[] = [];
        let { start, range } = input;
        for (const map of this._maps) {
            if (start < map.source) {
                if (range <= map.source - start) {
                    res.push({
                        start,
                        range
                    });
                    range = 0;
                    break;
                } else {
                    res.push({
                        start,
                        range: map.source - start
                    });
                    range -= map.source - start;
                    start = map.source;
                }
            }
            if (start >= map.source && start < map.source + map.range) {
                if (range <= map.source + map.range - start) {
                    res.push({
                        start: start + map.destination - map.source,
                        range
                    });
                    range = 0;
                    break;
                } else {
                    res.push({
                        start: start + map.destination - map.source,
                        range: map.source + map.range - start
                    });
                    range -= map.source + map.range - start;
                    start = map.source + map.range;
                }
            }
        }
        if (range > 0) {
            res.push({
                start,
                range
            });
        }
        return res;
    }
}

class Mappers {
    private _mappers: Mapper[];

    constructor(input: string[]) {
        this._mappers = this._parse(input);
    }

    public convert(input: number) {
        let res = input;
        let message = `${input}`;
        for (const map of this._mappers) {
            res = map.convert(res);
            message += ` => ${res}`;
        }
        console.log(`Convert - ${message}`);
        return res;
    }

    public convertNumRange(inputs: NumRange[]) {
        let res: NumRange[] = [...inputs];
        let message = `${JSON.stringify(res)}`;
        for (const map of this._mappers) {
            res = map.convertNumRange(res);
            message += ` => ${JSON.stringify(res)}`;
        }
        console.log(`Convert - ${message}`);
        return res;        
    }

    private _parse(input: string[]) {
        let res: Mapper[] = [];
        let buffer: string[] = [];
        for (let line of input) {
            line = line.trim();
            if (line === '') {
                continue;
            } else if (line.endsWith(' map:')) {
                if (buffer.length > 0) {
                    res.push(new Mapper(buffer));
                    buffer = [];
                }
            } else {
                buffer.push(line);
            }
        }
        if (buffer.length > 0) {
            res.push(new Mapper(buffer));
        }
        return res;
    }
}

function parseSeeds(input: string): NumRange[] {
    if (!input.startsWith('seeds: ')) {
        throw new Error('Invalid seed format');
    }
    const parts = input.substring('seeds: '.length).split(' ');
    if (parts.length % 2 !== 0) {
        throw new Error('Invalid seed number format');
    }
    let res = [];
    for (let i = 0; i < parts.length; i+=2) {
        res.push({
            start: Number(parts[i]),
            range: Number(parts[i+1])
        });
    }
    return res;
}

function main() {
    let data = fs.readFileSync('input.txt', 'utf8');
    let lines = data.split('\n');
    console.log(lines.length);

    const seeds = parseSeeds(lines.shift() ?? '');
    const mappers = new Mappers(lines);
    console.log(`seeds = ${JSON.stringify(seeds, null, 2)}`);
    console.log(`mappers = ${JSON.stringify(mappers, null, 2)}`);
    let lowestNumber = Number.MAX_VALUE;
    const val = mappers.convertNumRange(seeds);
    console.log(`lowestNumber = ${val[0].start}, val = ${JSON.stringify(val, null, 2)}`);
}

main();