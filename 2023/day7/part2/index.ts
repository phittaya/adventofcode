import fs from 'fs';

class Data {
    cards: CamelCards;
    bid: number;
}

enum CardType {
    HighCard = 0,
    OnePair,
    TwoPair,
    ThreeOfAKind,
    FullHouse,
    FourOfAKind,
    FiveOfAKind
};

const CardMapper: {[key: string]: number} = {
    'J': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    'T': 10,
    'Q': 12,
    'K': 13,
    'A': 14
};

class CamelCards {
    private _cards: string;
    private _type: CardType;
    constructor(input: string) {
        if (input.length !== 5) {
            throw new Error('Invalid Camel cards');
        }

        this._cards = input;
        this._type = this._getCardType(input);
    }

    public get cards() {
        return this._cards;
    }

    public get type() {
        return this._type;
    }

    public compare(other: CamelCards) {
        if (this.type < other.type) {
            return -1;
        } else if (this.type > other.type) {
            return 1;
        } else {
            for (let i = 0; i < this._cards.length; i++) {
                const res = this._compareSingleCard(this._cards[i], other.cards[i]);
                if (res !== 0) {
                    return res;
                }
            }
        }
        return 0;
    }

    private _getCardType(input: string) {
        const sortedCards = input.split('').sort(this._compareSingleCard);
        let groups: {[key: string]: number} = {};
        let jCount = 0;
        for (const card of sortedCards) {
            if (card === 'J') {
                jCount++;
                continue;
            }
            if (groups[card] === undefined) {
                groups[card] = 1;
            } else {
                groups[card] += 1;
            }
        }
        const groupNumber = Object.keys(groups).map(x => groups[x]).sort((a, b) => a - b);
        switch (groupNumber.length) {
        case 0:
        case 1:
            return CardType.FiveOfAKind;
        case 2:
            return (groupNumber[1] + jCount === 4) ? CardType.FourOfAKind : CardType.FullHouse;
        case 3:
            return (groupNumber[2] + jCount === 3) ? CardType.ThreeOfAKind : CardType.TwoPair;
        case 4:
            return CardType.OnePair;
        default:
            return CardType.HighCard;
        }
    }

    private _compareSingleCard(a: string, b: string) {
        if (CardMapper[a] < CardMapper[b]) {
            return -1;
        } else if (CardMapper[a] > CardMapper[b]) {
            return 1;
        } 
        return 0;
    }
}

function parseInput(input: string): Data {
    const parts = input.split(' ');
    if (parts.length !== 2) {
        throw new Error('Invalid input format');
    }
    return {
        cards: new CamelCards(parts[0].trim()),
        bid: Number(parts[1].trim())
    };
}

function main() {
    let data = fs.readFileSync('input.txt', 'utf8');
    let lines = data.split('\n');
    console.log(lines.length);

    let datas: Data[] = [];
    for (const line of lines) {
        const data = parseInput(line);
        datas.push(data);
    }

    datas.sort((a, b) => a.cards.compare(b.cards));

    let sum = 0;
    for (let i = 0; i < datas.length; i++) {
        const bidRank = datas[i].bid * (i + 1);
        sum += bidRank;
        console.log(`sum = ${sum}, i = ${i}, bidRank = ${bidRank}, data = ${JSON.stringify(datas[i], null, 2)}`);
    }
}

main();