(function () {
	'use strict';

	var PokerEvaluator = require('poker-evaluator');
	var Combinatorics = require('js-combinatorics');
	var utils = require('./utils');
	var cards = require('cards');

	module.exports = {
		evaluate: evaluate
	};

	/**
	 * evaluates a collection of cards for complete or partial hands
	 *
	 * @param {string[]} hand
	 * @returns {object} hand
	 * @returns {string[]} hand.cards
	 * @returns {string} hand.name
	 *
	 * @example
	 * evaluate(['Ad',' As', '2h', '3c', '8d']);
	 *   // {
	 *   //   cards: [ 'Ad', 'As' ],
	 *   //   name: 'high pair'
	 *   // }
	 */
	function evaluate(hand) {
		var initialEvalulation = PokerEvaluator.evalHand(hand);
		var fourCardHands = getPossibleFourCardHands(hand, initialEvalulation);
		var threeOfAKind;
		var straight;
		var flush;
		var fullHouse;
		
		// 1.
		//
		// straight flush, royal flush, and four of a kind are
		// first on the strategy table.
		//
		switch (initialEvalulation.handName) {
			case 'royal flush':
			case 'straight flush':
				return {
					cards: hand,
					name: initialEvalulation.handName
				};
				break;
			case 'four of a kind':
				return {
					hand: getFourOfAKind(hand),
					name: 'four of a kind'
				};
				break;
			case 'three of a kind':
				threeOfAKind = {
					hand: getThreeOfAKind(hand),
					name: 'three of a kind'
				};
				break;
			case 'straight':
				straight = {
					hand: hand,
					name: 'straight'
				};
				break;
			case 'flush':
				flush = {
					hand: hand,
					name: 'flush'
				};
				break;
			case 'full house':
				fullHouse = {
					hand: hand,
					name: 'full house'
				};
				break;
		}

		// 2.
		//
		// Four to a royal flush
		//
		if (fourCardHands.fourToRoyalFlush) {
			return fourCardHands.fourToRoyalFlush;
		}

		// 3.
		//
		// Three of a kind, straight, flush, full house
		//
		if (threeOfAKind) {
			return threeOfAKind;
		}

		if (straight) {
			return straight;
		}

		if (flush) {
			return flush;
		}

		if (fullHouse) {
			return fullHouse;
		}
		
	}

	/**
	 * Gets all possible four card hands with the given hand
	 *
	 * @param {string[]} hand
	 * @param {object} evaluation
	 * @returns {object}
	 */
	function getPossibleFourCardHands(hand, initialEvalulation) {
		var fourToRoyalFlush;
		var fourToStraightFlush;
		var fourToFlush;
		var fourToOutsideStraight;

		var otherCards = utils.getAllOtherCards(hand);
		Combinatorics
			.combination(hand, 4)
			.toArray()
			.forEach(function (combination) {
				// For each combination, sub in each of the remaining
				// cards and test for complete poker hands.
				otherCards.forEach(function (otherCard) {
					var comboClone = utils.clone(combination);
					var evaluation;

					comboClone.push(otherCard);
					evaluation = PokerEvaluator.evalHand(comboClone);
					switch (evaluation.handName) {
						case 'straight flush':
							if (utils.getValue(utils.sortByValue(comboClone)[0]) === 'T') {
								// royal
								fourToRoyalFlush = {
									cards: combination,
									name: 'four to a royal flush'
								}
							} else {
								// not royal
								fourToStraightFlush = {
									cards: combination,
									name: 'four to a straight flush'
								};
							}
							break;
						case 'flush':
							fourToFlush = {
								cards: combination,
								name: 'four to a flush'
							};
					}

					// Checking for an outside straight is not
					// quite as.. straight forward (lol)
				});
			});

		return {
			fourToRoyalFlush: fourToRoyalFlush,
			fourToStraightFlush: fourToStraightFlush,
			fourToFlush: fourToFlush,
			fourToOutsideStraight: fourToOutsideStraight
		};
	}

	/**
	 * Returns the four matching cards of a five card hand
	 *
	 * @param {string[]} hand
	 * @returns {string[] cards
	 */
	function getFourOfAKind(hand) {
		var sorted = utils.sortByValue(hand);
		if (utils.getValue(sorted[0]) === utils.getValue(sorted[1])) {
			return sorted.slice(0, 4);
		} else {
			return sorted.slice(1, 5);
		}
	}

	/**
	 * Returns three matching cards of a five card hand
	 *
	 * @param {string[]} hand
	 * @returns {string[]} cards
	 */
	function getThreeOfAKind(hand) {
		var result;

		Combinatorics
			.combination(hand, 3)
			.toArray()
			.forEach(function (combo) {
				if (utils.getValue(combo[0]) == utils.getValue(combo[1])
					&& utils.getValue(combo[0]) === utils.getValue(combo[2])) {
					result = combo;
				}
			});

		return result;
	}


})();