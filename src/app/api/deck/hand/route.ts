import { NextResponse } from 'next/server';
import { getOrInitializeDeck } from '../../../../utils/firestoreDeck';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const state = await getOrInitializeDeck(userId);
    return NextResponse.json({ 
      hand: state.hand,
      handSize: state.hand.length,
      deckSize: state.deck.length,
      discardPileSize: state.discardPile.length
    });
  } catch (error) {
    console.error('Hand error:', error);
    return NextResponse.json({ error: 'Failed to get hand' }, { status: 500 });
  }
}