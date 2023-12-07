import fs from 'fs';

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
}

class Mappers {
    private _mappers: Mapper[];

    constructor(input: string[]) {
        this._mappers = this._parse(input);
    }

    public convert(input: number) {
        let data = input;
        let message = `${input}`;
        for (const map of this._mappers) {
            data = map.convert(data);
            message += ` => ${data}`;
        }
        console.log(`Convert - ${message}`);
        return data;
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

function parseSeeds(input: string) {
    if (!input.startsWith('seeds: ')) {
        throw new Error('Invalid seed format');
    }
    return input.substring('seeds: '.length).split(' ').map(x => Number(x));
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
    for (const seed of seeds) {
        const val = mappers.convert(seed);
        lowestNumber = lowestNumber > val ? val : lowestNumber;
        console.log(`lowestNumber = ${lowestNumber}, seed = ${seed}, val = ${val}`);
    }
}

main();