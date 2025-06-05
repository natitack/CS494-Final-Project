import { NextResponse } from 'next/server';
import { getDeckState, setDeckState } from '../deckUtils';

export async function POST(request: Request) {
  try {
    const { cardIndex } = await request.json();
    
    if (cardIndex < 0) {
      return NextResponse.json({ error: 'Invalid card index' }, { status: 400 });
    }

    const state = await getDeckState();
    
    if (cardIndex >= state.hand.length) {
      return NextResponse.json({ error: 'Card index out of bounds' }, { status: 400 });
    }

    // Move card from hand to discard pile
    const discardedCard = state.hand.splice(cardIndex, 1)[0];
    state.discardPile.push(discardedCard);

    await setDeckState(state);
    return NextResponse.json({ success: true, discardedCard });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to discard card' }, { status: 500 });
  }
}