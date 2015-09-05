var prompt = require('prompt');
var analyzer = require('./lib/analyzer');
var Game = require('./lib/game');

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
console.log(game.deal());
prompt.get(['hold'], function (err, result) {
	var indexes = result.hold
					? result.hold.replace(/ /g, '')
						.split(',')
						.reduce(function (last, curr) { last.push(parseInt(curr, 10)); return last; }, [])
					: [];
	console.log(indexes);

	console.log(game.holdAndDraw(indexes));
});
