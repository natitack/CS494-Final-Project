import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import type { DeckState, Card } from "../types/deck";

export const SUITS = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
export const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export function createDeck(): Card[] {
  const newDeck: Card[] = [];
  for (const suit of SUITS) {
    for (const value of VALUES) {
      newDeck.push({ suit, value });
    }
  }
  return shuffle([...newDeck]);
}

export function shuffle(array: Card[]): Card[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function getDeckState(userId: string): Promise<DeckState | null> {
  try {
    const ref = doc(db, "decks", userId);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as DeckState) : null;
  } catch (error) {
    console.error('Error getting deck state:', error);
    return null;
  }
}

export async function setDeckState(userId: string, deckState: Partial<DeckState>) {
  try {
    const ref = doc(db, "decks", userId);
    const updateData = {
      ...deckState,
      userId,
      updatedAt: new Date()
    };
    await setDoc(ref, updateData, { merge: true });
  } catch (error) {
    console.error('Error setting deck state:', error);
    throw error;
  }
}

export async function initializeDeck(userId: string): Promise<DeckState> {
  const newDeckState: DeckState = {
    deck: createDeck(),
    hand: [],
    discardPile: [],
    userId,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  await setDeckState(userId, newDeckState);
  return newDeckState;
}

export async function getOrInitializeDeck(userId: string): Promise<DeckState> {
  let state = await getDeckState(userId);
  if (!state) {
    state = await initializeDeck(userId);
  }
  return state;
}