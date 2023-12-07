import fs from 'fs';

class Rule {
    time: number;
    distance: number;
}

function countIntegerBetweenNumbers(a: number, b: number)
{
    var start = (a === Math.ceil(a)) ? a + 1 : Math.ceil(a);
    var end = (b === Math.floor(b)) ? b - 1: Math.floor(b);
    return end - start + 1;
}

function distanceCalculator(input: Rule) {
    // Distance = (Time - x) * x
    // x2 - Time(x) + Distance = 0
    const x = (input.time * input.time) - 4 * input.distance;
    if (x < 0) {
        throw new Error('No valid answers');
    }
    const a = ((input.time) - Math.sqrt(x)) / 2;
    const b = ((input.time) + Math.sqrt(x)) / 2;
    console.log(`a = ${a}, b = ${b}`);
    return {
        start: a,
        end: b
    }
}

function parseInputs(inputs: string[]): Rule {
    if (inputs.length !== 2) {
        throw new Error('Invalid input format');
    }
    if (!inputs[0].startsWith('Time:')) {
        throw new Error('Invalid Time format');
    }
    const time = Number(inputs[0].substring('Time:'.length).replace(/ /g, ''));
    
    if (!inputs[1].startsWith('Distance:')) {
        throw new Error('Invalid Distance format');
    }
    const distance = Number(inputs[1].substring('Distance:'.length).replace(/ /g, ''));
    
    return {
        time,
        distance
    };
}

function main() {
    let data = fs.readFileSync('input.txt', 'utf8');
    let lines = data.split('\n');
    console.log(lines.length);

    const rule = parseInputs(lines);
    let totalWays = 1;
    const val = distanceCalculator(rule);
    const count = countIntegerBetweenNumbers(val.start, val.end);
    totalWays *= count;
    console.log(`totalWays = ${totalWays}, count = ${count}, time = ${rule.time}, distance = ${rule.distance}, val = ${JSON.stringify(val, null, 2)}`);
}

main();