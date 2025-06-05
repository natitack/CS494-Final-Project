export type Card = {
  suit: string;
  value: string;
};

export type DeckState = {
  deck: Card[];
  hand: Card[];
  discardPile: Card[];
};