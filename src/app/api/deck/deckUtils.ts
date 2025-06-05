import type { Card } from '../../types/deck';

export const SUITS = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
export const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export function createDeck(): Card[] {
  const newDeck: Card[] = [];
  for (const suit of SUITS) {
    for (const value of VALUES) {
      newDeck.push({ suit, value });
    }
  }
  return newDeck;
}

export function shuffle(array: Card[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}