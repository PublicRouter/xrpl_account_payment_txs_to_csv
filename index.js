// forward	Boolean	(Optional) Defaults to false. If set to true, returns values indexed with the oldest ledger first. Otherwise, the results are indexed with the newest ledger first. (Each page of results may not be internally ordered, but the pages are overall ordered.)
// can optionally add "limit" property to request object to limit amount of tx returned
// reference: https://xrpl.org/account_tx.html

const xrpl = require('xrpl');
require('dotenv').config();

const fs = require('fs');

async function retrieveAccountTxs(account) {
    const client = new xrpl.Client('wss://s1.ripple.com/');

    const convertUnixToReadableTime = (rippleTime) => {
        const unixTimestamp = rippleTime + 946684800;
        const dateObj = new Date(unixTimestamp * 1000);
        const readableDate = dateObj.toUTCString();
        return readableDate;
    };

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

    const objectArray = response.result.transactions;
    let newObjArray = [];

    for (const object of objectArray) {
        if (object.tx.TransactionType === "Payment") {
            const newObject = {
                Account: object.tx.Account ? object.tx.Account : "",
                Amount: object.tx.Amount ? (Math.round((object.tx.Amount / 1000000) * 100) / 100).toFixed(2) : "",
                Destination: object.tx.Destination ? object.tx.Destination : "",
                Memo: object.tx.Memos ? "True" : "False",
                Fee: object.tx.Fee ? object.tx.Fee : "",
                LastLedgerSequence: object.tx.LastLedgerSequence ? object.tx.LastLedgerSequence : "",
                Sequence: object.tx.Sequence ? object.tx.Sequence : "",
                SigningPubKey: object.tx.SigningPubKey ? object.tx.SigningPubKey : "",
                TransactionType: object.tx.TransactionType ? object.tx.TransactionType : "",
                TxnSignature: object.tx.TxnSignature ? object.tx.TxnSignature : "",
                hash: object.tx.hash ? object.tx.hash : "",
                ledger_index: object.tx.ledger_index ? object.tx.ledger_index : "",
                date: object.tx.date ? convertUnixToReadableTime(object.tx.date) : ""
            };

            newObjArray.push(newObject);
        };
    };

   console.log("Payment txs array in uniform format: ",newObjArray)
};

retrieveAccountTxs(process.env.MAINNET_WALLET_1)