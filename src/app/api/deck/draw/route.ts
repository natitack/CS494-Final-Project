import { NextResponse } from 'next/server';
import { getDeckState, setDeckState } from '../deckUtils';
export async function POST(request: Request) {
  try {
    const { count } = await request.json();
    
    if (!count || count < 1) {
      return NextResponse.json({ error: 'Invalid count' }, { status: 400 });
    }

    const state = await getDeckState();
    
    if (state.deck.length < count) {
      return NextResponse.json({ error: 'Not enough cards in deck' }, { status: 400 });
    }

    // Draw cards from deck to hand
    const drawnCards = state.deck.splice(0, count);
    state.hand.push(...drawnCards);

    await setDeckState(state);
    return NextResponse.json({ success: true, drawnCards });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to draw cards' }, { status: 500 });
  }
}