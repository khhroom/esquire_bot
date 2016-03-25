var URL = "https://esquire.ru/quotes/";
var INTERVAL = 15 * 60 * 1000; // milliseconds 


var debug = require('debug')('esquire:quotes')
debug('started');

var request = require('request-promise');
var cheerio = require('cheerio');
var moment = require('moment');

var storage = require('node-persist').create({ dir: __dirname + '/persist/quotes' });
storage.initSync();

var events = require('events');
var quotes = new events.EventEmitter();


var current = storage.getItemSync('current') || {}; 

update();
setInterval(update, INTERVAL);



function update() {
  debug('updating');
  var url = URL; // + moment().utcOffset('+0300').subtract(1, 'days').format('DDMMYYYY'); // Not needed
  request(url)
    .then(function (body) {
      var $ = cheerio.load(body);
      var newquote = {};
      $('.quote').each(function() {
        var date = $(this).find('.quote-date').text();
        if (!newquote.date || moment(date, 'DDMMYYYY') > moment(newquote.date, 'DDMMYYYY')) {
          var text = $(this).find('.quote-text').text();
          var author = $(this).find('.quote-author-name').text() + ' (' + $(this).find('.quote-author-desc').text() + ')';
          newquote.text = text + ', ' + author;
          newquote.date = date;
        }
      });

      if (current.date !== newquote.date) {
        current.text = newquote.text;
        current.date = newquote.date;

        storage.setItem('current', current);

        quotes.emit('updated', current.text);
      }      
    })
    .catch(function (error) {
      debug('update failed: %s', error);
    })

}


quotes.getCurrent = function() {
  return current.text;
}

module.exports = exports = quotes;
