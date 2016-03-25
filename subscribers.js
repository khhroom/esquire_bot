var debug = require('debug')('esquire:subscription');
debug('started');

var storage = require('node-persist').create({ dir: __dirname + '/persist/subscribers' });
storage.initSync();

var bot = require('./bot');


var subscribers = {
  add: function(id, info) {
    storage.setItem(id.toString(), info);
    debug('subscriber added: ', id);
  },
  remove: function(id) {
    storage.removeItem(id.toString());
    debug('subscriber removed: ', id);
  } 
};

var quotes = require('./quotes');
quotes.on('updated', function(quote) {
  debug('quote updated:', quote);
  storage.forEach(function(id, subscriber) {
    bot.sendMessage(id, quote);
  });
});

module.exports = exports = subscribers;
