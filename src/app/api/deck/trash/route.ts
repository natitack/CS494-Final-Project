import { NextResponse } from 'next/server';
import { getDeckState, setDeckState } from '../firestoreDeck';

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

    // Remove card from hand completely (trash it)
    const trashedCard = state.hand.splice(cardIndex, 1)[0];

    await setDeckState(state);
    return NextResponse.json({ success: true, trashedCard });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to trash card' }, { status: 500 });
  }
}