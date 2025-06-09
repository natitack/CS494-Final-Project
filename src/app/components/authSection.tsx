interface AuthSectionProps {
  onSignIn: () => void;
}

export default function AuthSection({ onSignIn }: AuthSectionProps) {
  return (
    <div className="card bg-base-100 shadow-xl mb-8">
      <div className="card-body text-center">
        <h2 className="card-title justify-center">Sign in to play</h2>
        <p>You need to sign in with Google to save your deck state.</p>
        <button 
          className="btn btn-primary"
          onClick={onSignIn}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}