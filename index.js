'use strict';

const config = require('./config.json');
const cc = require('currency-converter')({
    CLIENTKEY: config.app_id,
});
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(config.bot_token, { polling: true });

console.log("currencybot running");

bot.onText(/\/convert (\w{3}) (\w{3}) (\d+([,\.]\d+)?)/i, function(msg, match) {
    console.log(match);
});

bot.on('message', function(msg) {
    console.log(msg);
});
