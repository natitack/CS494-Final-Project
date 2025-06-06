export interface Card {
  suit: string;
  value: string;
}

export interface DeckState {
  deck: Card[];
  hand: Card[];
  discardPile: Card[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}