import { useState } from 'react';

interface DeckState {
  hand: any[];
  deckSize: number;
  discardPileSize: number;
}

interface GameControlsProps {
  deckState: DeckState;
  loading: boolean;
  onDrawCards: (count: number) => Promise<void>;
  onResetDeck: () => Promise<void>;
}

export default function GameControls({ deckState, loading, onDrawCards, onResetDeck }: GameControlsProps) {
  const [drawCount, setDrawCount] = useState<number>(1);

  const handleDrawCards = async () => {
    if (drawCount < 1) return;
    await onDrawCards(drawCount);
  };

  return (
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
      </div>

      <div className="flex gap-2 mt-4">
        <button
        className={`btn btn-primary ${loading ? 'loading' : ''}`}
        onClick={handleDrawCards}
        disabled={loading || deckState.deckSize === 0}
        >
        {loading ? '' : `Draw ${drawCount} Card${drawCount !== 1 ? 's' : ''}`}
        </button>
        
        <button
        className={`btn btn-secondary ${loading ? 'loading' : ''}`}
        onClick={onResetDeck}
        disabled={loading}
        >
        {loading ? '' : 'Reset Deck'}
        </button>
      </div>
      
      {/* Deck Info */}
      <div className="flex flex-wrap gap-4 mt-4">
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
  );
}