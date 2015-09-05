(function () {
	'use strict';

	var cards = require('cards');
	cards.useArc4 = true;

	module.exports = Game;

	/**
	 * Game class constructor
	 */
	function Game() {
		this.deck = new cards.PokerDeck({ jokers: 0 });
		cards.seedArc4(+ new Date());
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
	Game.prototype.holdAndDraw = function (indexesToHold) {
		var held = [];
		var heldLength;

		for (var i = 0; i < this.deck.held.length; i++) {
			if (indexesToHold.indexOf(i) > -1) {
				held.push(this.deck.held[i]);
			}
		}
		heldLength = held.length;
		this.deck.discardAllHeld();

		for (var i = 0; i < (5 - heldLength); i++) {
			this.deck.draw();
			held.push(this.deck.held[i]);
		}

		return held;
	}


})();