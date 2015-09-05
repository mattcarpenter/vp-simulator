var prompt = require('prompt');
var analyzer = require('./lib/analyzer');
var Game = require('./lib/game');
var utils = require('./lib/utils');

prompt.start();

/*

// example: As, Jd

prompt.get(['hand'], function (err, result) {
	var hand = result.hand.replace(/ /g, '').split(',');
	var results = analyzer.evaluate(hand);
	console.log('Results', results);
});
*/

var game = new Game();
var hand = utils.toFlatCards(game.deal());
console.log(hand);
var ideal = analyzer.evaluate(hand);
console.log('ideal:');
console.log(ideal);
prompt.get(['hold'], function (err, result) {
	var finalHand = utils.toFlatCards(game.holdAndDraw(result.hold.replace(/ /g, '').split(',')));
	var results = analyzer.evaluate(finalHand, true);
	console.log(finalHand);
	console.log(results);
});
