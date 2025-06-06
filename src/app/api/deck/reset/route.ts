import { NextResponse } from 'next/server';
import { initializeDeck } from '../../../../utils/firestoreDeck';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const newState = await initializeDeck(userId);
    return NextResponse.json({ 
      success: true,
      message: 'Deck reset successfully',
      deckSize: newState.deck.length,
      handSize: newState.hand.length,
      discardPileSize: newState.discardPile.length
    });
  } catch (error) {
    console.error('Reset error:', error);
    return NextResponse.json({ error: 'Failed to reset deck' }, { status: 500 });
  }
}