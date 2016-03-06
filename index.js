'use strict';

const config = require('./config.json');
const cc = require('currency-converter')({
    CLIENTKEY: config.app_id,
});
const TelegramBot = require('node-telegram-bot-api');
const numeral = require('numeral');

const bot = new TelegramBot(config.bot_token, { polling: true });

console.log("currencybot running");

function error(msg, err) {
    console.error(err);
    console.trace();

    bot.sendMessage(msg.chat.id, "An error occured. Did you specify an unsupported currency?", {
        reply_to_message_id: msg.message_id,
    });
}

function convert(msg, amount, convertFrom, convertTo) {
    return cc.convert(amount, convertFrom, convertTo, true)
        .then(function(result) {
            console.log(`${convertFrom} -> ${convertTo}`);
            console.log(result);
            console.log();

            const format = '0,0.00';

            const fromAmount = numeral(amount).format(format);
            const toAmount = numeral(result.amount).format(format);

            const text = `${fromAmount} ${convertFrom} is ${toAmount} ${convertTo}`;

            return bot.sendMessage(msg.chat.id, text, {
                reply_to_message_id: msg.message_id,
            });
        });
}

bot.onText(/\/(convert|cc) (\w{3}) (\w{3}) (\d+([,\.]\d+)?)/i, function(msg, match) {
    const amount = Number(match[4].replace(',', '.'));
    const convertFrom = match[2].toUpperCase();
    const convertTo = match[3].toUpperCase();

    convert(msg, amount, convertFrom, convertTo)
        .catch(err => error(msg, err));
});

bot.onText(/\/(convert|cc) (\d+([,\.]\d+)?) (\w{3}) (to|in) (\w{3})/i, function(msg, match) {
    const amount = Number(match[2].replace(',', '.'));
    const convertFrom = match[4].toUpperCase();
    const convertTo = match[6].toUpperCase();

    convert(msg, amount, convertFrom, convertTo)
        .catch(err => error(msg, err));
});
