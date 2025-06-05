"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { Card, DeckState } from "../app/types/deck";
import { createDeck, shuffle } from "../app/api/deck/deckUtils";

/**
 * Context for sharing props and prop manipulation functions across the app.
 *
 * Usage:
 * 1. Wrap your app (or part of it) with <PropsProvider> in your layout or root component:
 *    <PropsProvider>
 *      <App />
 *    </PropsProvider>
 *
 * 2. Access and update props from any child component using the useChoices hook:
 *    import { useProps } from "../context/Context";
 *    const { props, updateProp, propsMap, getPropFromMap, updatePropInMap } = useProps();
 *
 *    // Example usage:
 *    updateProp("value1", "newValue");
 *    updatePropInMap("customKey", "customValue");
 *    const value = getPropFromMap("customKey");
 */

interface PropsContextType {
    props: {
        value1: string;
        value2: string;
        value3: string;
        [key: string]: string;
    };
    updateProp: (key: string, value: string) => void;
    propsMap: Map<string, string>;
    getPropFromMap: (key: string) => string | undefined;
    updatePropInMap: (key: string, value: string) => void;

    // Deck state and functions
    deckState: DeckState;
    setDeckState: React.Dispatch<React.SetStateAction<DeckState>>;
    resetGame: () => void;
    drawCard: () => void;
    discardCard: (card: Card) => void;
}

const DefaultContext = createContext<PropsContextType | undefined>(undefined);

interface PropsProviderProps {
    children: ReactNode;
}

export const PropsProvider = ({ children }: PropsProviderProps) => {
    const [props, setProps] = useState({
        value1: "string",
        value2: "string",
        value3: "string"
    });

    // Example map to store additional data
    const [propsMap, setPropsMap] = useState<Map<string, string>>(new Map());

    const getPropFromMap = useCallback((key: string) => {
        return propsMap.get(key);
    }, [propsMap]);

    const updatePropInMap = useCallback((key: string, value: string) => {
        setPropsMap(prev => {
            const newMap = new Map(prev);
            newMap.set(key, value);
            return newMap;
        });
    }, []);

    const updateProp = useCallback((key: string, value: string) => {
        setProps((prev) => {
            const newProps = { ...prev, [key]: value };
            localStorage.setItem("brandChoices", JSON.stringify(newProps)); // Save to localStorage
            return newProps;
        });
    }, []);

    // Deck state
    const [deckState, setDeckState] = useState<DeckState>({
        deck: [],
        hand: [],
        discardPile: []
    });

    // Reset game: create and shuffle a new deck
    const resetGame = useCallback(() => {
        const deck = createDeck();
        shuffle(deck);
        setDeckState({ deck, hand: [], discardPile: [] });
    }, []);

    // Draw a card from the deck to the hand
    const drawCard = useCallback(() => {
        setDeckState(prev => {
            if (prev.deck.length === 0) return prev;
            const [card, ...rest] = prev.deck;
            return {
                ...prev,
                deck: rest,
                hand: [...prev.hand, card]
            };
        });
    }, []);

    // Discard a card from the hand to the discard pile
    const discardCard = useCallback((card: Card) => {
        setDeckState(prev => {
            const hand = prev.hand.filter(
                c => !(c.suit === card.suit && c.value === card.value)
            );
            return {
                ...prev,
                hand,
                discardPile: [...prev.discardPile, card]
            };
        });
    }, []);

    return (
        <DefaultContext.Provider
            value={{
                props,
                updateProp,
                propsMap,
                getPropFromMap,
                updatePropInMap,
                deckState,
                setDeckState,
                resetGame,
                drawCard,
                discardCard
            }}
        >
            {children}
        </DefaultContext.Provider>
    );
};

/**
 * Custom hook to access the Props context.
 * Throws an error if used outside of PropsProvider.
 */
export const useProps = () => {
    const context = useContext(DefaultContext);
    if (!context) {
        throw new Error("useProps must be used within a PropsProvider");
    }
    return context;
};