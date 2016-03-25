var TOKEN = process.env.TOKEN;

var debug = require('debug')('esquire:bot');
debug('started');

var TelegramBot = require('node-telegram-bot-api'); 

var bot = new TelegramBot(TOKEN, { polling: true });

module.exports = exports = bot;
