import fs from 'fs';
const digitStrings = [
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine'
];

const digitNumbers: { [key: string] :string} = {
    'one': '1',
    'two': '2',
    'three': '3',
    'four': '4',
    'five': '5',
    'six': '6',
    'seven': '7',
    'eight': '8',
    'nine': '9'
}

function isTextNumber(input: string, position: number) {
    for (const digit of digitStrings) {
        if (input.startsWith(digit, position)) {
            return digitNumbers[digit];
        }
    }
    return null;
}

function isCharNumber(input: string) {
    return (input >= '0' && input <= '9');
}

function gettNumbers(data: string): string[] {
    const numbers = [];
    for (let i = 0; i < data.length; i++) {
        if (isCharNumber(data[i])) {
            numbers.push(data[i]);
        }
        else {
            const num = isTextNumber(data, i);
            if (num !== null) {
                numbers.push(num);
            }
        }
    }
    return numbers;
}

function main() {
    var data = fs.readFileSync('input.txt', 'utf8');
    var lines = data.split('\n');
    console.log(lines.length);
    let sum = 0;
    for (const line of lines) {
        const numbers = gettNumbers(line);
        const first = numbers[0];
        const last = numbers[numbers.length - 1];
        const value = Number(first + last);
        sum += value;
        console.log(`sum = ${sum}, value = ${value}, string = ${line}`);
    }
}

main();