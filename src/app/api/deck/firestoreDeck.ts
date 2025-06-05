import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import type { DeckState, Card } from "../../types/deck";

const db = getFirestore();

export async function getDeckState(deckId: string): Promise<DeckState | null> {
    const ref = doc(db, "decks", deckId);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as DeckState) : null;
}

export async function setDeckState(deckId: string, deckState: DeckState) {
    const ref = doc(db, "decks", deckId);
    await setDoc(ref, deckState);
}

export async function drawCard(deckId: string) {
    const ref = doc(db, "decks", deckId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const deckState = snap.data() as DeckState;
    if (deckState.deck.length === 0) return;
    const [card, ...rest] = deckState.deck;
    await updateDoc(ref, {
        deck: rest,
        hand: [...deckState.hand, card]
    });
}

export async function discardCard(deckId: string, card: Card) {
    const ref = doc(db, "decks", deckId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const deckState = snap.data() as DeckState;
    const hand = deckState.hand.filter(
        c => !(c.suit === card.suit && c.value === card.value)
    );
    await updateDoc(ref, {
        hand,
        discardPile: [...deckState.discardPile, card]
    });
}