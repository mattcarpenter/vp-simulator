var prompt = require('prompt');
var analyzer = require('./lib/analyzer');
var Game = require('./lib/game');
var utils = require('./lib/utils');

var payTable = {
	'high pair': 5,
	'two pairs': 10,
	'three of a kind': 15,
	'straight': 20,
	'flush': 30,
	'full house': 45,
	'four of a kind': 125,
	'straight flush': 250,
	'royal flush': 4000
};

prompt.start();



// example: As, Jd

prompt.get(['hand'], function (err, result) {
	var hand = result.hand.replace(/ /g, '').split(',');
	var results = analyzer.evaluate(hand);
	console.log('Results', results);
});


/*
var wins = 0;
var losses = 0;
var balance = 0;

for (var i = 0; i < 500; i++) {
	var game = new Game();
	balance -= 5;
	var hand = utils.toFlatCards(game.deal());
	//console.log(hand);
	var ideal = analyzer.evaluate(hand);
	//console.log('ideal:');
	//console.log(ideal);
	//prompt.get(['hold'], function (err, result) {
		//var finalHand = utils.toFlatCards(game.holdAndDraw(result.hold.replace(/ /g, '').split(',')));
		var finalHand = utils.toFlatCards(game.holdAndDraw(ideal.cards));
		var results = analyzer.evaluate(finalHand, true);

		if (results.name !== 'nothing') {
			console.log(results);
			wins++;
			balance += payTable[results.name];
			if (isNaN(payTable[results.name])) {
				console.log('error: no pay table entry for ' + results.name);
			}
		} else {
			console.log('loss');
			losses++;
		}
	//});
}

console.log('Wins:', wins);
console.log('Losses:', losses);
console.log('Balance:', balance);
*/