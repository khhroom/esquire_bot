var USAGE = 'Поддерживаемые команды:\n'
  + '/quote - узнать цитату дня\n'
  + '/subscribe - подписаться на ежедневные цитаты\n'
  + '/unsubscribe - отписать от ежедневных цитат\n';

var debug = require('debug')('esquire:app');
debug('started');

var bot = require('./bot');

var quotes = require('./quotes');

var subscribers = require('./subscribers');



bot.on('text', function(request) {
  debug('message received: ', request);

  var command = resolveCommand(request.text.trim());

  if (!command || !command.name) {
    return;
  }

  var response = '';

  switch (command.name) {
    case 'start':
      response = 'Цитата дня: ' + quotes.getCurrent() + '\n\n' + USAGE;
      break;
    case 'help':
      response = USAGE;
      break;
    case 'quote':
      response = quotes.getCurrent();
      break;
    case 'subscribe':
      subscribers.add(request.chat.id, request.from);
      response = 'Вы подписались на ежедневную цитату';
      break;
    case 'unsubscribe':
      subscribers.remove(request.chat.id);
      response = 'Вы отказались от подписки на ежедневную цитату';
      break;
    default:
      response = 'Непоняяяяяятно...' + '\n\n' + USAGE;
      break;
  }

  bot.sendMessage(request.chat.id, response);

  debug('message sent: ', response);   
});



function resolveCommand(message) {
  if (!message.startsWith("/")) {
    return;
  }

  var parts = message.substr(1).split(" ");

  if (!parts.length) {
    return;
  }

  return {
    name: parts[0],
    parameters: parts.slice(1),
  }  

}