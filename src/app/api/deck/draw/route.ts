import { NextResponse } from 'next/server';
import { setDeckState, getOrInitializeDeck } from '../../../../utils/firestoreDeck';


export async function POST(request: Request) {
  try {
    const { userId, count = 1 } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }
    
    if (!count || count < 1 || count > 10) {
      return NextResponse.json({ error: 'Invalid count (1-10)' }, { status: 400 });
    }

    const state = await getOrInitializeDeck(userId);
    
    if (state.deck.length < count) {
      return NextResponse.json({ error: 'Not enough cards in deck' }, { status: 400 });
    }

    // Draw cards from deck to hand
    const drawnCards = state.deck.splice(0, count);
    state.hand.push(...drawnCards);

    await setDeckState(userId, state);
    return NextResponse.json({ 
      success: true, 
      drawnCards,
      remainingDeck: state.deck.length,
      handSize: state.hand.length
    });
  } catch (error) {
    console.error('Draw error:', error);
    return NextResponse.json({ error: 'Failed to draw cards' }, { status: 500 });
  }
}
