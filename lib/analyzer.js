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
		var threeCardHands = getPossibleThreeCardHands(hand, initialEvalulation);
		var twoCardHands = getPossibleTwoCardHands(hand, initialEvalulation);
		var threeOfAKind;
		var straight;
		var flush;
		var fullHouse;
		var twoPairs;
		var highPair;
		var lowPair;
		
		// 1.
		//
		// straight flush, royal flush, and four of a kind
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
					cards: getFourOfAKind(hand),
					name: 'four of a kind'
				};
				break;
			case 'three of a kind':
				threeOfAKind = {
					cards: getThreeOfAKind(hand),
					name: 'three of a kind'
				};
				break;
			case 'straight':
				straight = {
					cards: hand,
					name: 'straight'
				};
				break;
			case 'flush':
				flush = {
					cards: hand,
					name: 'flush'
				};
				break;
			case 'full house':
				fullHouse = {
					cards: hand,
					name: 'full house'
				};
				break;
			case 'two pairs':
				twoPairs = {
					cards: getTwoPairs(hand),
					name: 'two pairs'
				};
				break;
			case 'one pair':
				var pair = getPair(hand);
				if (isNaN(utils.getValue(pair[0]))) {
					highPair = {
						cards: pair,
						name: 'high pair'
					};
				} else {
					lowPair = {
						cards: pair,
						name: 'low pair'
					}
				}
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

		// 4.
		//
		// Four to a straight flush
		//

		if (fourCardHands.fourToStraightFlush) {
			return fourCardHands.fourToStraightFlush;
		}

		// 5.
		//
		// Two pairs
		//

		if (twoPairs) {
			return twoPairs;
		}

		// 6.
		//
		// High pair
		//

		if (highPair) {
			return highPair;
		}

		// 7.
		//
		// Three to a royal flush
		//

		if (threeCardHands.threeToRoyalFlush) {
			return threeCardHands.threeToRoyalFlush;
		}

		// 8.
		//
		// Four to a flush
		//

		if (fourCardHands.fourToFlush) {
			return fourCardHands.fourToFlush;
		}

		// 9.
		//
		// Low pair
		//

		if (lowPair) {
			return lowPair;
		}

		// 10.
		//
		// Four to an outside straight
		//

		if (fourCardHands.fourToOutsideStraight) {
			return fourCardHands.fourToOutsideStraight;
		}

		// 11.
		//
		// Two suited high cards
		//

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
							break;
						case 'straight':
							// only check for outside straight
							var isSequential = true;

							utils.sortByValue(combination).reduce(function (lastVal, currVal) {
								if (lastVal === null) {
									return currVal;
								}

								if (utils.getRank(currVal) !== (utils.getRank(lastVal) + 1)) {
									//console.log('currVal', utils.getRank(currVal));
									//console.log('lastVal', utils.getRank(lastVal));
									isSequential = false;
								}
								return currVal;
							}, null);

							if (isSequential) {
								fourToOutsideStraight = {
									cards: combination,
									name: 'four to an outside straight'
								};
							}
							break;
					}
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
	 * Gets all possible three card hands
	 *
	 * @param {string[]} hand
	 * @param {object} initialEvaluation
	 * @returns {object}
	 */
	function getPossibleThreeCardHands(hand, initialEvalulation) {
		var threeToRoyalFlush;
		var threeToStraightFlush;

		var otherCards = utils.getAllOtherCards(hand);
		Combinatorics
			.combination(hand, 3)
			.toArray()
			.forEach(function (combination) {
				otherCards.forEach(function (card1) {
					otherCards.forEach(function (card2) {
						var comboClone = utils.clone(combination);
						var evaluation;

						if (card1 === card2) {
							// not a valid combination
							return;
						}

						comboClone.push(card1, card2);
						evaluation = PokerEvaluator.evalHand(comboClone);

						if (evaluation.handName === 'straight flush'
							&& utils.getValue(utils.sortByValue(comboClone)[0]) === 'T') {
							threeToRoyalFlush = {
								cards: combination,
								name: 'three to a royal flush'
							};
						}

					});
				})
			});

		return {
			threeToRoyalFlush: threeToRoyalFlush,
			threeToStraightFlush: threeToStraightFlush
		};
	}

	/**
	 * Gets all possible two card hands
	 *
	 * @param {string[]} hand
	 * @param {object} initialEvaluation
	 * @returns {object}
	 */
	function getPossibleTwoCardHands(hand, initialEvalulation) {

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

	/**
	 * Returns cards that make up two pairs
	 *
	 * @param {string[]} hand
	 * @returns {string[]}
	 */
	function getTwoPairs(hand) {
		var result;

		Combinatorics
			.combination(hand, 4)
			.toArray()
			.forEach(function (combo) {
				// if combo only has two types of cards,
				// we've found the two pair
				var seen = {};
				combo.forEach(function (card) {
					seen[utils.getValue(card)] = 1;
				});

				if (Object.keys(seen).length === 2) {
					result = combo;
				}
			});

		return result;
	}

	/**
	 * Returns the matching pair
	 *
	 * @param {string[]} hand
	 * @returns {string[]}
	 */
	function getPair(hand) {
		var result;

		Combinatorics
			.combination(hand, 2)
			.toArray()
			.forEach(function (combo) {
				if (utils.getValue(combo[0]) === utils.getValue(combo[1])) {
					result = combo;
				}
			});

		return result;
	}


})();