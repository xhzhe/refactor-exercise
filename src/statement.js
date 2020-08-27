const TRAGEDY = 'tragedy';

const COMEDY = 'comedy';

function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;
    const format = USDFormat();
    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        let thisAmount = generateAmount(play.type, perf.audience);
        // add volume credits
        volumeCredits += Math.max(perf.audience - 30, 0);
        // add extra credit for every ten comedy attendees
        if (COMEDY === play.type) volumeCredits += Math.floor(perf.audience / 5);
        //print line for this order
        result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
        totalAmount += thisAmount;
    }
    result += `Amount owed is ${format(totalAmount / 100)}\n`;
    result += `You earned ${volumeCredits} credits \n`;
    return result;
}

function generateAmount(type, audience) {
    let thisAmount = 0;
    switch (type) {
        case TRAGEDY:
            thisAmount = 40000;
            if (audience > 30) {
                thisAmount += 1000 * (audience - 30);
            }
            break;
        case COMEDY:
            thisAmount = 30000;
            if (audience > 20) {
                thisAmount += 10000 + 500 * (audience - 20);
            }
            thisAmount += 300 * audience;
            break;
        default:
            throw new Error(`unknown type: ${type}`);
    }
    return thisAmount;
}

function USDFormat() {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format;
}

module.exports = {
    statement,
};