var prompt = require('prompt');
var analyzer = require('./lib/analyzer');

prompt.start();

// example: As, Jd
prompt.get(['hand'], function (err, result) {
	var hand = result.hand.replace(/ /g, '').split(',');
	var results = analyzer.evaluate(hand);
	console.log('Results', results);
});