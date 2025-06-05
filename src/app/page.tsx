'use client';

import { useState, useEffect } from 'react';

interface Card {
  suit: string;
  value: string;
}

interface DeckState {
  deck: Card[];
  hand: Card[];
  discardPile: Card[];
}

export default function CardGamePage() {
  const [deckState, setDeckState] = useState<DeckState>({
    deck: [],
    hand: [],
    discardPile: []
  });
  const [drawCount, setDrawCount] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch current deck state
  const fetchDeckState = async () => {
    try {
      const response = await fetch('/api/deck/state');
      if (response.ok) {
        const state = await response.json();
        setDeckState(state);
      }
    } catch (error) {
      console.error('Error fetching deck state:', error);
    }
  };

  // Draw cards
  const drawCards = async () => {
    if (drawCount < 1) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/deck/draw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count: drawCount }),
      });
      
      if (response.ok) {
        await fetchDeckState();
      }
    } catch (error) {
      console.error('Error drawing cards:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reset deck
  const resetDeck = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/deck/reset', {
        method: 'POST',
      });
      
      if (response.ok) {
        await fetchDeckState();
      }
    } catch (error) {
      console.error('Error resetting deck:', error);
    } finally {
      setLoading(false);
    }
  };

  // Discard a card
  const discardCard = async (cardIndex: number) => {
    setLoading(true);
    try {
      const response = await fetch('/api/deck/discard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardIndex }),
      });
      
      if (response.ok) {
        await fetchDeckState();
      }
    } catch (error) {
      console.error('Error discarding card:', error);
    } finally {
      setLoading(false);
    }
  };

  // Trash a card (remove from game)
  const trashCard = async (cardIndex: number) => {
    setLoading(true);
    try {
      const response = await fetch('/api/deck/trash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardIndex }),
      });
      
      if (response.ok) {
        await fetchDeckState();
      }
    } catch (error) {
      console.error('Error trashing card:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load initial state
  useEffect(() => {
    fetchDeckState();
  }, []);

  // Get card color for display
  const getCardColor = (suit: string) => {
    return suit === 'Hearts' || suit === 'Diamonds' ? 'text-red-500' : 'text-black';
  };

  // Get suit symbol
  const getSuitSymbol = (suit: string) => {
    const symbols = {
      Hearts: '♥',
      Diamonds: '♦',
      Clubs: '♣',
      Spades: '♠'
    };
    return symbols[suit as keyof typeof symbols] || suit;
  };

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Card Game</h1>
        
        {/* Control Panel */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title">Game Controls</h2>
            
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Number of cards to draw</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={drawCount}
                  onChange={(e) => setDrawCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="input input-bordered w-full max-w-xs"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  className={`btn btn-primary ${loading ? 'loading' : ''}`}
                  onClick={drawCards}
                  disabled={loading || deckState.deck.length === 0}
                >
                  Draw Cards
                </button>
                
                <button
                  className={`btn btn-secondary ${loading ? 'loading' : ''}`}
                  onClick={resetDeck}
                  disabled={loading}
                >
                  Reset Deck
                </button>
              </div>
            </div>
            
            {/* Deck Info */}
            <div className="stats stats-horizontal shadow mt-4">
              <div className="stat">
                <div className="stat-title">Cards in Deck</div>
                <div className="stat-value text-primary">{deckState.deck.length}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Cards in Hand</div>
                <div className="stat-value text-secondary">{deckState.hand.length}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Discarded</div>
                <div className="stat-value text-accent">{deckState.discardPile.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hand Display */}
        {deckState.hand.length > 0 && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Your Hand</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {deckState.hand.map((card, index) => (
                  <div key={index} className="card bg-white border border-gray-300 shadow-md">
                    <div className="card-body p-4 text-center">
                      <div className={`text-2xl font-bold ${getCardColor(card.suit)}`}>
                        {card.value}
                      </div>
                      <div className={`text-xl ${getCardColor(card.suit)}`}>
                        {getSuitSymbol(card.suit)}
                      </div>
                      
                      <div className="card-actions justify-center mt-2">
                        <button
                          className={`btn btn-xs btn-warning ${loading ? 'loading' : ''}`}
                          onClick={() => discardCard(index)}
                          disabled={loading}
                        >
                          Discard
                        </button>
                        <button
                          className={`btn btn-xs btn-error ${loading ? 'loading' : ''}`}
                          onClick={() => trashCard(index)}
                          disabled={loading}
                        >
                          Trash
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty Hand Message */}
        {deckState.hand.length === 0 && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <h2 className="card-title justify-center">Your Hand is Empty</h2>
              <p>Draw some cards to get started!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}