'use strict';

const config = require('./config.json');
const cc = require('currency-converter')({
    CLIENTKEY: config.app_id,
});
const TelegramBot = require('node-telegram-bot-api');
const numeral = require('numeral');

const bot = new TelegramBot(config.bot_token, { polling: true });

console.log("currencybot running");

bot.onText(/\/convert (\w{3}) (\w{3}) (\d+([,\.]\d+)?)/i, function(msg, match) {
    const convertFrom = match[1].toUpperCase();
    const convertTo = match[2].toUpperCase();
    const amount = Number(match[3].replace(',', '.'));

    cc.convert(amount, convertFrom, convertTo)
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
        })
        .catch(function(err) {
            console.error(err);
            console.trace();

            bot.sendMessage(msg.chat.id, "An error occured. Did you specify an unsupported currency?", {
                reply_to_message_id: msg.message_id,
            });
        });
});

bot.on('message', function(msg) {
    // console.log(msg);
});
