import { User } from 'firebase/auth';

interface UserHeaderProps {
  user: User;
  onSignOut: () => void;
}

export default function UserHeader({ user, onSignOut }: UserHeaderProps) {
  return (
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
        onClick={onSignOut}
      >
        Sign Out
      </button>
    </div>
  );
}