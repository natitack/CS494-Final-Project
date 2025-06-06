import React, { useState } from "react";
import { useUserContext } from "../../context/Context";

const Login: React.FC = () => {
    const { user, googleSignIn, logOut } = useUserContext();
    const [error, setError] = useState<string | null>(null);

    const handleGoogleLogin = async () => {
        setError(null);
        try {
            await googleSignIn();
        } catch (err) {
            setError("Google sign-in failed");
        }
    };

    return (
        <div>
            {user ? (
                <button className="btn btn-error" onClick={logOut}>
                    Logout
                </button>
            ) : (
                <>
                    <button className="btn btn-primary" onClick={handleGoogleLogin}>
                        Sign in
                    </button>
                    {error && <div className="text-red-500 mt-2">{error}</div>}
                </>
            )}
        </div>
    );
};

export default Login;