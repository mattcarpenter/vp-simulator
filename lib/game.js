(function () {
	'use strict';

	var utils = require('./utils');
	var cards = require('cards');
	var crypto = require('crypto');

	cards.useArc4 = true;

	cards.seedArc4(process.hrtime());

	module.exports = Game;

	/**
	 * Game class constructor
	 */
	function Game() {
		this.deck = new cards.PokerDeck();
		this.deck.shuffleAll();
	}

	/**
	 * Deals a hand of cards
	 */
	Game.prototype.deal = function () {
		this.deck.draw(5);

		return this.deck.held;
	}

	/**
	 * Discards unheld cards and draws replacements
	 *
	 * @param {number[]} indexesToHold indexes of cards to hold
	 * @returns {object}
	 */
	Game.prototype.holdAndDraw = function (cardsToHold) {
		var self = this;
		console.log('holding ', cardsToHold);

		var numberOfCardsHeld = cardsToHold.length;

		this.deck.held.forEach(function (cardInHand) {
			if (cardsToHold.indexOf(utils.toFlatCard(cardInHand)) === -1) {
				self.deck.remove(cardInHand);
			}
		});
		
		//?
		//this.deck.discardAllHeld();
		//this.deck.shuffleAll();

		this.deck.draw(5 - numberOfCardsHeld);

		return this.deck.held;
	}


})();