'use client';

import { useState } from 'react';
import { useUserContext } from '@/context/Context';
import { useDeckContext } from '@/context/DeckContext';
import PlayingCard from './components/playingCard';

export default function CardGamePage() {
  const { user, googleSignIn, logOut } = useUserContext();
  const {
    deckState,
    loading,
    error,
    success,
    drawCards,
    resetDeck,
    discardCard,
    trashCard
  } = useDeckContext();

  const [drawCount, setDrawCount] = useState<number>(1);

  // Handle drawing cards
  const handleDrawCards = async () => {
    if (drawCount < 1) return;
    await drawCards(drawCount);
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
                      onClick={handleDrawCards}
                      disabled={loading || deckState.deckSize === 0}
                    >
                      {loading ? '' : `Draw ${drawCount} Card${drawCount !== 1 ? 's' : ''}`}
                    </button>
                    
                    <button
                      className={`btn btn-secondary ${loading ? 'loading' : ''}`}
                      onClick={resetDeck}
                      disabled={loading}
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
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                    {deckState.hand.map((card, index) => (
                      <PlayingCard
                        key={`${card.suit}-${card.value}-${index}`}
                        card={card}
                        index={index}
                      />
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