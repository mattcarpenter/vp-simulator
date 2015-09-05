(function () {
	'use strict';

	var utils = require('./utils');
	var cards = require('cards');
	var crypto = require('crypto');

	cards.useArc4 = true;
	cards.seedArc4(crypto.randomBytes(8).toString());

	module.exports = Game;

	/**
	 * Game class constructor
	 */
	function Game() {
		this.deck = new cards.PokerDeck({ jokers: 0 });
		this.deck.shuffleAll();
	}

	/**
	 * Deals a hand of cards
	 */
	Game.prototype.deal = function () {
		for (var i = 0; i < 5; i++) {
			this.deck.draw();
		}

		return this.deck.held;
	}

	/**
	 * Discards unheld cards and draws replacements
	 *
	 * @param {number[]} indexesToHold indexes of cards to hold
	 * @returns {object}
	 */
	Game.prototype.holdAndDraw = function (cardsToHold) {
		var held = [];
		var heldLength;

		this.deck.held.forEach(function (cardInHand) {
			if (cardsToHold.indexOf(utils.toFlatCard(cardInHand)) > -1) {
				held.push(cardInHand);
			}
		});
		
		heldLength = held.length;
		this.deck.discardAllHeld();

		for (var i = 0; i < (5 - heldLength); i++) {
			this.deck.draw();
			held.push(this.deck.held[i]);
		}

		return held;
	}


})();