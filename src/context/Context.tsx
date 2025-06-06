"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

import { auth } from "../services/firebase";

import { signOut, signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";

interface UserContextType {
    user: User | null;
    googleSignIn: () => Promise<void>;
    logOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserContextProviderProps {
    children: ReactNode;
}

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
    const [user, setUser] = useState<User | null>(null);

    const googleSignIn = useCallback(async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            setUser(result.user);
        } catch (error) {
            console.error("Google sign-in error:", error);
        }
    }, []);

    const logOut = useCallback(async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("Sign out error:", error);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
            setUser(firebaseUser);
        });
        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ user, googleSignIn, logOut }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserContextProvider");
    }
    return context;
};
