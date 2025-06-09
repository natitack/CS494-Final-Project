interface EmptyHandMessageProps {
  deckSize: number;
}

export default function EmptyHandMessage({ deckSize }: EmptyHandMessageProps) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body text-center">
        <h2 className="card-title justify-center">Your Hand is Empty</h2>
        <p>Draw some cards to get started!</p>
        {deckSize === 0 && (
          <p className="text-warning">No cards left in deck! Reset to continue playing.</p>
        )}
      </div>
    </div>
  );
}