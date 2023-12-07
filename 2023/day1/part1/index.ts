import fs from 'fs';
function gettNumbers(data: string): string[] {
    const numbers = [];
    for (const c of data) {
        if (c >= '0' && c <= '9') {
            numbers.push(c);
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