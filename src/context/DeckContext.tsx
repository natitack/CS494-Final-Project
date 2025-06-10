"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { useUserContext } from "./Context";
import type { Card} from "../types/deck";

interface ClientDeckState {
  hand: Card[];
  deckSize: number;
  discardPileSize: number;
}

interface ApiResponse {
  success?: boolean;
  error?: string;
  hand?: Card[];
  handSize?: number;
  deckSize?: number;
  discardPileSize?: number;
  drawnCards?: Card[];
  remainingDeck?: number;
  discardedCard?: Card;
  trashedCard?: Card;
  message?: string;
}

interface DeckContextType {
  deckState: ClientDeckState;
  loading: boolean;
  error: string | null;
  success: string | null;
  drawCards: (count: number) => Promise<void>;
  resetDeck: () => Promise<void>;
  discardCard: (cardIndex: number) => Promise<void>;
  trashCard: (cardIndex: number) => Promise<void>;
  fetchDeckState: () => Promise<void>;
}

const DeckContext = createContext<DeckContextType | undefined>(undefined);

interface DeckContextProviderProps {
  children: ReactNode;
}

export const DeckContextProvider = ({ children }: DeckContextProviderProps) => {
  const { user } = useUserContext();
  const userId = user?.uid;

  const [deckState, setDeckState] = useState<ClientDeckState>({
    hand: [],
    deckSize: 0,
    discardPileSize: 0
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Clear messages after a delay
  const clearMessages = useCallback(() => {
    setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 10000);
  }, []);

  // Show error message
  const showError = useCallback((message: string) => {
    setError(message);
    clearMessages();
  }, [clearMessages]);

  // Show success message
  const showSuccess = useCallback((message: string) => {
    setSuccess(message);
    clearMessages();
  }, [clearMessages]);

  // Fetch current hand and deck info
  const fetchDeckState = useCallback(async () => {
    if (!userId) return;
    
    try {
      const response = await fetch('/api/deck/hand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch deck state');
      }

      const data: ApiResponse = await response.json();
      setDeckState({
        hand: data.hand || [],
        deckSize: data.deckSize || 0,
        discardPileSize: data.discardPileSize || 0,
      });
    } catch (error) {
      console.error('Error fetching deck state:', error);
      showError(error instanceof Error ? error.message : 'Failed to fetch deck state');
    }
  }, [userId, showError]);

  // Draw cards
  const drawCards = useCallback(async (count: number) => {
    if (count < 1 || !userId) return;
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/deck/draw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, count }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to draw cards');
      }

      if (data.success) {
        // Update state optimistically
        setDeckState(prev => ({
          hand: [...prev.hand, ...(data.drawnCards || [])],
          deckSize: data.remainingDeck || 0,
          discardPileSize: prev.discardPileSize
        }));
        showSuccess(`Drew ${data.drawnCards?.length || count} card(s)`);
      }
    } catch (error) {
      console.error('Error drawing cards:', error);
      showError(error instanceof Error ? error.message : 'Failed to draw cards');
      // Refresh state on error
      await fetchDeckState();
    } finally {
      setLoading(false);
    }
  }, [userId, showError, showSuccess, fetchDeckState]);

  // Reset deck
  const resetDeck = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/deck/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset deck');
      }

      if (data.success) {
        setDeckState({
          hand: [],
          deckSize: data.deckSize || 52,
          discardPileSize: 0
        });
        showSuccess('Deck reset successfully!');
      }
    } catch (error) {
      console.error('Error resetting deck:', error);
      showError(error instanceof Error ? error.message : 'Failed to reset deck');
    } finally {
      setLoading(false);
    }
  }, [userId, showError, showSuccess]);

  // Discard a card
  const discardCard = useCallback(async (cardIndex: number) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/deck/discard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, cardIndex }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to discard card');
      }

      if (data.success) {
        // Update state optimistically
        const newHand = [...deckState.hand];
        const discardedCard = newHand.splice(cardIndex, 1)[0];
        setDeckState(prev => ({
          hand: newHand,
          deckSize: prev.deckSize,
          discardPileSize: prev.discardPileSize + 1
        }));
        showSuccess(`Discarded ${discardedCard.value} of ${discardedCard.suit}`);
      }
    } catch (error) {
      console.error('Error discarding card:', error);
      showError(error instanceof Error ? error.message : 'Failed to discard card');
      // Refresh state on error
      await fetchDeckState();
    } finally {
      setLoading(false);
    }
  }, [userId, deckState.hand, showError, showSuccess, fetchDeckState]);

  // Trash a card (remove from game)
  const trashCard = useCallback(async (cardIndex: number) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/deck/trash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, cardIndex }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to trash card');
      }

      if (data.success) {
        // Update state optimistically
        const newHand = [...deckState.hand];
        const trashedCard = newHand.splice(cardIndex, 1)[0];
        setDeckState(prev => ({
          hand: newHand,
          deckSize: prev.deckSize,
          discardPileSize: prev.discardPileSize
        }));
        showSuccess(`Trashed ${trashedCard.value} of ${trashedCard.suit}`);
      }
    } catch (error) {
      console.error('Error trashing card:', error);
      showError(error instanceof Error ? error.message : 'Failed to trash card');
      // Refresh state on error
      await fetchDeckState();
    } finally {
      setLoading(false);
    }
  }, [userId, deckState.hand, showError, showSuccess, fetchDeckState]);

  // Load initial state when user changes
  useEffect(() => {
    if (userId) {
      fetchDeckState();
    } else {
      // Reset state when user logs out
      setDeckState({
        hand: [],
        deckSize: 0,
        discardPileSize: 0
      });
      setError(null);
      setSuccess(null);
    }
  }, [userId, fetchDeckState]);

  return (
    <DeckContext.Provider value={{
      deckState,
      loading,
      error,
      success,
      drawCards,
      resetDeck,
      discardCard,
      trashCard,
      fetchDeckState
    }}>
      {children}
    </DeckContext.Provider>
  );
};

export const useDeckContext = () => {
  const context = useContext(DeckContext);
  if (!context) {
    throw new Error("useDeckContext must be used within a DeckContextProvider");
  }
  return context;
};