import { NextResponse } from 'next/server';
import { resetGame } from '../deckUtils';

export async function POST() {
  try {
    await resetGame();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reset game' }, { status: 500 });
  }
}