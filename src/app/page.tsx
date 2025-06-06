'use client';

import { useState, useEffect } from 'react';
import { useUserContext } from '@/context/Context';

interface Card {
  suit: string;
  value: string;
}

interface DeckState {
  hand: Card[];
  deckSize: number;
  discardPileSize: number;
}

interface ApiResponse {
  success?: boolean;
  error?: string;
  hand?: Card[];
  handSize?: number;
  deckSize?: number;
  discardPileSize?: number;
  drawnCards?: Card[];
  remainingDeck?: number;
  discardedCard?: Card;
  trashedCard?: Card;
  message?: string;
}

export default function CardGamePage() {
  const { user, googleSignIn, logOut } = useUserContext();
  const userId = user?.uid;

  const [deckState, setDeckState] = useState<DeckState>({
    hand: [],
    deckSize: 0,
    discardPileSize: 0
  });
  const [drawCount, setDrawCount] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Clear messages after a delay
  const clearMessages = () => {
    setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 10000);
  };

  // Show error message
  const showError = (message: string) => {
    setError(message);
    clearMessages();
  };

  // Show success message
  const showSuccess = (message: string) => {
    setSuccess(message);
    clearMessages();
  };

  // Fetch current hand and deck info
  const fetchDeckState = async () => {
    if (!userId) return;
    
    try {
      const response = await fetch('/api/deck/hand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch deck state');
      }

      const data: ApiResponse = await response.json();
      setDeckState({
        hand: data.hand || [],
        deckSize: data.deckSize || 0,
        discardPileSize: data.discardPileSize || 0,
      });
    } catch (error) {
      console.error('Error fetching deck state:', error);
      showError(error instanceof Error ? error.message : 'Failed to fetch deck state');
    }
  };

  // Draw cards
  const drawCards = async () => {
    if (drawCount < 1 || !userId) return;
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/deck/draw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, count: drawCount }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to draw cards');
      }

      if (data.success) {
        // Update state optimistically
        setDeckState(prev => ({
          hand: [...prev.hand, ...(data.drawnCards || [])],
          deckSize: data.remainingDeck || 0,
          discardPileSize: prev.discardPileSize
        }));
        showSuccess(`Drew ${data.drawnCards?.length || drawCount} card(s)`);
      }
    } catch (error) {
      console.error('Error drawing cards:', error);
      showError(error instanceof Error ? error.message : 'Failed to draw cards');
      // Refresh state on error
      await fetchDeckState();
    } finally {
      setLoading(false);
    }
  };

  // Reset deck
  const resetDeck = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/deck/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset deck');
      }

      if (data.success) {
        setDeckState({
          hand: [],
          deckSize: data.deckSize || 52,
          discardPileSize: 0
        });
        showSuccess('Deck reset successfully!');
      }
    } catch (error) {
      console.error('Error resetting deck:', error);
      showError(error instanceof Error ? error.message : 'Failed to reset deck');
    } finally {
      setLoading(false);
    }
  };

  // Discard a card
  const discardCard = async (cardIndex: number) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/deck/discard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, cardIndex }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to discard card');
      }

      if (data.success) {
        // Update state optimistically
        const newHand = [...deckState.hand];
        const discardedCard = newHand.splice(cardIndex, 1)[0];
        setDeckState(prev => ({
          hand: newHand,
          deckSize: prev.deckSize,
          discardPileSize: prev.discardPileSize + 1
        }));
        showSuccess(`Discarded ${discardedCard.value} of ${discardedCard.suit}`);
      }
    } catch (error) {
      console.error('Error discarding card:', error);
      showError(error instanceof Error ? error.message : 'Failed to discard card');
      // Refresh state on error
      await fetchDeckState();
    } finally {
      setLoading(false);
    }
  };

  // Trash a card (remove from game)
  const trashCard = async (cardIndex: number) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/deck/trash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, cardIndex }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to trash card');
      }

      if (data.success) {
        // Update state optimistically
        const newHand = [...deckState.hand];
        const trashedCard = newHand.splice(cardIndex, 1)[0];
        setDeckState(prev => ({
          hand: newHand,
          deckSize: prev.deckSize,
          discardPileSize: prev.discardPileSize
        }));
        showSuccess(`Trashed ${trashedCard.value} of ${trashedCard.suit}`);
      }
    } catch (error) {
      console.error('Error trashing card:', error);
      showError(error instanceof Error ? error.message : 'Failed to trash card');
      // Refresh state on error
      await fetchDeckState();
    } finally {
      setLoading(false);
    }
  };

  // Load initial state
  useEffect(() => {
    if (userId) {
      fetchDeckState();
    }
  }, [userId]);

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
        
        {/* Authentication Section */}
        {!user ? (
          <div className="card bg-base-100 shadow-xl mb-8">
            <div className="card-body text-center">
              <h2 className="card-title justify-center">Sign in to play</h2>
              <p>You need to sign in with Google to save your deck state.</p>
              <button 
                className="btn btn-primary"
                onClick={googleSignIn}
              >
                Sign in with Google
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* User Info */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                {user.photoURL && (
                  <img 
                    src={user.photoURL} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <span className="text-lg">Welcome, {user.displayName || user.email}!</span>
              </div>
              <button 
                className="btn btn-outline btn-sm"
                onClick={logOut}
              >
                Sign Out
              </button>
            </div>
        
        {/* Error/Success Messages */}
        {error && (
          <div className="alert alert-error mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="alert alert-success mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{success}</span>
          </div>
        )}
        
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
                  onChange={(e) => setDrawCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                  className="input input-bordered w-full max-w-xs"
                  disabled={loading}
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  className={`btn btn-primary ${loading ? 'loading' : ''}`}
                  onClick={drawCards}
                  disabled={loading || deckState.deckSize === 0 || !userId}
                >
                  {loading ? '' : `Draw ${drawCount} Card${drawCount !== 1 ? 's' : ''}`}
                </button>
                
                <button
                  className={`btn btn-secondary ${loading ? 'loading' : ''}`}
                  onClick={resetDeck}
                  disabled={loading || !userId}
                >
                  {loading ? '' : 'Reset Deck'}
                </button>
              </div>
            </div>
            
            {/* Deck Info */}
            <div className="stats stats-horizontal shadow mt-4">
              <div className="stat">
                <div className="stat-title">Cards in Deck</div>
                <div className="stat-value text-primary">{deckState.deckSize}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Cards in Hand</div>
                <div className="stat-value text-secondary">{deckState.hand.length}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Discarded</div>
                <div className="stat-value text-accent">{deckState.discardPileSize}</div>
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
                  <div key={`${card.suit}-${card.value}-${index}`} className="card bg-white border border-gray-300 shadow-md">
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
                          disabled={loading || !userId}
                        >
                          Discard
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
              {deckState.deckSize === 0 && (
                <p className="text-warning">No cards left in deck! Reset to continue playing.</p>
              )}
            </div>
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
}