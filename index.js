// forward	Boolean	(Optional) Defaults to false. If set to true, returns values indexed with the oldest ledger first. Otherwise, the results are indexed with the newest ledger first. (Each page of results may not be internally ordered, but the pages are overall ordered.)
// can optionally add "limit" property to request object to limit amount of tx returned
// reference: https://xrpl.org/account_tx.html

const xrpl = require('xrpl');
require('dotenv').config();

async function retrieveAccountTxs(account) {
    const client = new xrpl.Client('wss://s1.ripple.com/');

    await client.connect();
    const response = await client.request({
        "id": 2,
        "command": "account_tx",
        "account": account,
        "ledger_index_min": -1,
        "ledger_index_max": -1,
        "binary": false,
        "forward": false
    });
    await client.disconnect();

    console.log(response);
};

retrieveAccountTxs(process.env.MAINNET_WALLET_1)