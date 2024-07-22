const axios = require("axios");

const cookie = `your_cookie`;

async function sendRequest(amount) {
    const response = await axios({
        method: 'post',
        url: "https://stake.com/_api/graphql",
        headers: {
            "authority": "stake.com",
            ":method": "POST",
            ":path": "/_api/graphql",
            ":scheme": "https",
            "accept": "*/*",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-length": "749",
            "content-type": "application/json",
            "cookie": cookie,
            "origin": "https://stake.com",
            "priority": "u=1, i",
            "referer": "https://stake.com/casino/games/dice",
            "sec-ch-ua": ``,
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": `"Android"`,
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent": "",
            "x-access-token": "",
            "x-lockdown-token": ""
        },
        data: `{"query":"mutation DiceRoll($amount: Float!, $target: Float!, $condition: CasinoGameDiceConditionEnum!, $currency: CurrencyEnum!, $identifier: String!) {\\n  diceRoll(\\n    amount: $amount\\n    target: $target\\n    condition: $condition\\n    currency: $currency\\n    identifier: $identifier\\n  ) {\\n    ...CasinoBet\\n    state {\\n      ...CasinoGameDice\\n    }\\n  }\\n}\\n\\nfragment CasinoBet on CasinoBet {\\n  id\\n  active\\n  payoutMultiplier\\n  amountMultiplier\\n  amount\\n  payout\\n  updatedAt\\n  currency\\n  game\\n  user {\\n    id\\n    name\\n  }\\n}\\n\\nfragment CasinoGameDice on CasinoGameDice {\\n  result\\n  target\\n  condition\\n}\\n","variables":{"target":50.5,"condition":"above","identifier":"uix6CkiHQqTnDNYHZXt8T","amount":` + amount + `,"currency":"usdt"}}`
    });

    return response.data.data;
}

const DEFAULT_AMOUNT = 0.01;
async function main() {
    let amount = DEFAULT_AMOUNT;
    let lossesInARow = 0;
    while (1) {
        console.log(`Betting ${amount}`);
        try {
            const response = await sendRequest(amount);
            if (response.diceRoll.state.result < 50.5) {
                console.log(`Lost`);
                lossesInARow++;
                amount = amount * 2;
            } else {
                console.log(`Won`);
                lossesInARow = 0;
                amount = DEFAULT_AMOUNT;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            if (lossesInARow >= 13) {
                console.log("Stopping");
                process.exit(0);
            }
        } catch (e) {
            console.log("Error came");
        }
    }
}

main();
