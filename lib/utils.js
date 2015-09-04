(function () {
	'use strict';

	var cards = require('cards');
	var fullDeck = [];
	var cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

	module.exports = {
		getValue: getValue,
		getSuite: getSuite,
		sortByValue: sortByValue,
		getAllOtherCards: getAllOtherCards,
		clone: clone,
		getRank: getRank
	};

	// Calculate ascii deck
	['d', 's', 'c', 'h'].forEach(function (suite) {
		for (var i = 2; i < 10; i++) {
			fullDeck.push(i + suite);
		}

		['T', 'J', 'Q', 'K', 'A'].forEach(function (high) {
			fullDeck.push(high + suite);
		});
	});

	/**
	 * Returns a card's value
	 */
	function getValue(card) {
		return card.substr(0,1);
	}

	/**
	 * Returns a card's rank
	 */
	function getRank(card) {
		return cardValues.indexOf(getValue(card).toString());
	}

	/**
	 * Returns a card's getSuite
	 */
	function getSuite(card) {
		return card.slice(1);
	}

	/**
	 * Sorts a hand by card value; suite ignored
	 *
	 * @param {string[]} hand
	 * @returns {string[]}
	 */
	function sortByValue(hand) {
		return hand.sort(function (a, b) {
			var aVal = cardValues.indexOf(getValue(a).toString());
			var bVal = cardValues.indexOf(getValue(b).toString());
			if (aVal< bVal) {
				return -1;
			} else if (aVal === bVal) {
				return 0;
			} else {
				return 1;
			}
		});
	}

	/**
	 * Returns an array of each card *not* present
	 * in the given hand.
	 *
	 * @param {string[]} hand
	 * @returns {string[]}
	 */ 
	function getAllOtherCards(hand) {
		var deck = clone(fullDeck);
		var others = [];
		deck.forEach(function (card) {
			if (hand.indexOf(card) === -1) {
				others.push(card);
			}
		});

		return others;
	}

	/**
	 * Returns all combinations of cards 
	function powerSet(hand, length) {

	}

	/**
	 * Returns a clone of the input
	 */
	function clone(input) {
		if (Array.isArray(input)) {
			return input.slice(0);
		};

		// todo: clone other data types
	}
})();