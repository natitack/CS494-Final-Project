import { NextResponse } from 'next/server';
import { getDeckState, setDeckState, getOrInitializeDeck } from '../../../../utils/firestoreDeck';

export async function POST(request: Request) {
  try {
    const { userId, cardIndex } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }
    
    if (typeof cardIndex !== 'number' || cardIndex < 0) {
      return NextResponse.json({ error: 'Invalid card index' }, { status: 400 });
    }

    const state = await getOrInitializeDeck(userId);
    
    if (cardIndex >= state.hand.length) {
      return NextResponse.json({ error: 'Card index out of bounds' }, { status: 400 });
    }

    // Remove card from hand completely (trash it)
    const trashedCard = state.hand.splice(cardIndex, 1)[0];

    await setDeckState(userId, state);
    return NextResponse.json({ 
      success: true, 
      trashedCard,
      handSize: state.hand.length
    });
  } catch (error) {
    console.error('Trash error:', error);
    return NextResponse.json({ error: 'Failed to trash card' }, { status: 500 });
  }
}