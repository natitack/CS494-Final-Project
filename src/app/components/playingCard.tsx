import { useState } from 'react';
import { useDeckContext } from '@/context/DeckContext';

interface Card {
  suit: string;
  value: string;
}

interface PlayingCardProps {
  card: Card;
  index: number;
}

export default function PlayingCard({ card, index }: PlayingCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { discardCard, trashCard, loading } = useDeckContext();

  // Convert card data to filename format
  const getImagePath = (card: Card) => {
    // Convert suit names to lowercase
    const suit = card.suit.toLowerCase();
    
    // Convert value to match filename format
    let value = card.value.toLowerCase();
    if (value === 'a') value = 'ace';
    else if (value === 'j') value = 'jack';
    else if (value === 'q') value = 'queen';
    else if (value === 'k') value = 'king';

    return `/cards/${value}_of_${suit}.png`;
  };

  // Get card color for fallback display
  const getCardColor = (suit: string) => {
    return suit === 'Hearts' || suit === 'Diamonds' ? 'text-red-500' : 'text-black';
  };

  // Get suit symbol for fallback display
  const getSuitSymbol = (suit: string) => {
    const symbols = {
      Hearts: '♥',
      Diamonds: '♦',
      Clubs: '♣',
      Spades: '♠'
    };
    return symbols[suit as keyof typeof symbols] || suit;
  };

  const handleDiscard = () => {
    discardCard(index);
  };

  const handleTrash = () => {
    trashCard(index);
  };

  return (
    <div 
      className="relative group cursor-pointer transition-transform duration-200 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Image - now uses full container width with proper aspect ratio */}
      <div className="relative w-full aspect-[2.5/3.5] rounded-lg overflow-hidden shadow-lg bg-white border border-gray-200">
        <img
          src={getImagePath(card)}
          alt={`${card.value} of ${card.suit}`}
          className="w-full h-full object-contain"
          onError={(e) => {
            // Fallback to text-based card display if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        
        {/* Fallback text display (hidden by default) */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center bg-white"
          style={{ display: 'none' }}
        >
          <div className={`text-2xl sm:text-3xl font-bold ${getCardColor(card.suit)}`}>
            {card.value}
          </div>
          <div className={`text-xl sm:text-2xl ${getCardColor(card.suit)}`}>
            {getSuitSymbol(card.suit)}
          </div>
        </div>
      </div>

      {/* Action Buttons - Only visible on hover, responsive sizing */}
      <div className={`absolute top-1 right-1 sm:top-2 sm:right-2 flex flex-col gap-1 transition-opacity duration-200 ${
        isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <button
          className={`btn btn-xs sm:btn-sm btn-error text-white ${loading ? 'loading' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            handleDiscard();
          }}
          disabled={loading}
          title="Discard this card"
        >
          {!loading && 'Discard'}
        </button>
        
        <button
          className={`btn btn-xs sm:btn-sm btn-warning text-white ${loading ? 'loading' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            handleTrash();
          }}
          disabled={loading}
          title="Trash this card (remove from game)"
        >
          {!loading && 'Trash'}
        </button>
      </div>
    </div>
  );
}