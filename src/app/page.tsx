'use client';

import { useUserContext } from '@/context/Context';
import { useDeckContext } from '@/context/DeckContext';
import AuthSection from './components/authSection';
import UserHeader from './components/userHeader';
import AlertMessages from './components/alertMessages';
import GameControls from './components/gameControls';
import HandDisplay from './components/handDisplay';
import EmptyHandMessage from './components/emptyHandMessage';

export default function CardGamePage() {
  const { user, googleSignIn, logOut } = useUserContext();
  const {
    deckState,
    loading,
    error,
    success,
    drawCards,
    resetDeck,
  } = useDeckContext();

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Card Game</h1>
        
        {/* Authentication Section */}
        {!user ? (
          <AuthSection onSignIn={googleSignIn} />
        ) : (
          <>
            {/* User Info */}
            <UserHeader user={user} onSignOut={logOut} />

            {/* Main Game Area */}
            <div className="flex flex-col md:flex-row gap-6 mt-6">
              {/* Left: Game Controls and Alerts */}
              <div className="md:w-1/3 flex flex-col gap-4">
                <GameControls 
                  deckState={deckState}
                  loading={loading}
                  onDrawCards={drawCards}
                  onResetDeck={resetDeck}
                />
                <AlertMessages error={error} success={success} />
              </div>
              {/* Right: Hand Display */}
              <div className="md:w-2/3">
                {deckState.hand.length > 0 ? (
                  <HandDisplay hand={deckState.hand} />
                ) : (
                  <EmptyHandMessage deckSize={deckState.deckSize} />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}