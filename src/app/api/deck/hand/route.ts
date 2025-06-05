import { NextRequest, NextResponse } from 'next/server';
import { getDeckState } from '../deckUtils';

export async function POST() {
  const state = await getDeckState();
  return NextResponse.json({ hand: state.hand });
}