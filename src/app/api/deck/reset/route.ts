import { NextRequest, NextResponse } from 'next/server';
import { resetGame, getDeckState } from '../deckUtils';

export async function POST() {
  await resetGame();
  const state = await getDeckState();
  return NextResponse.json({ message: 'Deck reset', deckCount: state.deck.length });
}