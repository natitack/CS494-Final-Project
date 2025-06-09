import PlayingCard from './playingCard';

interface Card {
  suit: string;
  value: string;
}

interface HandDisplayProps {
  hand: Card[];
}

export default function HandDisplay({ hand }: HandDisplayProps) {
  if (hand.length === 0) {
    return null;
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Your Hand</h2>
        
        {/* Use flexbox with explicit card sizing */}
        <div className="mt-8 flex flex-wrap gap-6 justify-center">
          {hand.map((card, index) => (
            <div 
              key={`${card.suit}-${card.value}-${index}`} 
              className="w-24 sm:w-28 md:w-32 lg:w-32 flex-shrink-0"
            >
              <PlayingCard
                card={card}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}