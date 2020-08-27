const TRAGEDY = 'tragedy';

const COMEDY = 'comedy';

function statement(invoice, plays, type = 'default') {
    let totalAmount = 0;
    let volumeCredits = 0;
    let playList = [];
    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        let thisAmount = generateAmount(perf.audience, play.type);
        volumeCredits += generateVolumeCredits(perf.audience, play.type);
        playList.push({
            name: play.name,
            thisAmount: thisAmount,
            audience: perf.audience
        })
        totalAmount += thisAmount;
    }
    return generateResult(totalAmount, playList, volumeCredits, USDFormat(), invoice.customer, type);
}

function generateAmount(audience, type) {
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

function generateVolumeCredits(audience, type) {
    let volumeCredits = 0;
    // add volume credits
    volumeCredits += Math.max(audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if (COMEDY === type) volumeCredits += Math.floor(audience / 5);
    return volumeCredits;
}

function USDFormat() {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format;
}

function generateResult(totalAmount, playList, volumeCredits, format, nameOfCustomer, type) {
    if (type === 'html') {
        return generateHtmlResult(totalAmount, playList, volumeCredits, format, nameOfCustomer);
    }
    return generateDefaultResult(totalAmount, playList, volumeCredits, format, nameOfCustomer);
}

function generateHtmlResult(totalAmount, playList, volumeCredits, format, nameOfCustomer) {
    let result = `<h1>Statement for ${nameOfCustomer}</h1>\n` +
        '<table>\n' +
        '<tr><th>play</th><th>seats</th><th>cost</th></tr>';
    for (let play of playList) {
        //print line for this order
        result += ` <tr><td>${play.name}</td><td>${play.audience}</td><td>${format(play.thisAmount / 100)}</td></tr>\n`;
    }
    result += '</table>\n'
    result += `<p>Amount owed is <em>${format(totalAmount / 100)}</em></p>\n`;
    result += `<p>You earned <em>${volumeCredits}</em> credits</p>\n`;
    return result
}

function generateDefaultResult(totalAmount, playList, volumeCredits, format, nameOfCustomer) {
    let result = `Statement for ${nameOfCustomer}\n`;
    for (let play of playList) {
        //print line for this order
        result += ` ${play.name}: ${format(play.thisAmount / 100)} (${play.audience} seats)\n`;
    }
    result += `Amount owed is ${format(totalAmount / 100)}\n`;
    result += `You earned ${volumeCredits} credits \n`;
    return result
}

module.exports = {
    statement,
};