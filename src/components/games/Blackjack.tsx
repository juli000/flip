'use client';

import { useState, useEffect } from 'react';
import { Card } from 'react-playing-cards';
import { Button } from '@/components/ui/button';

interface BlackjackProps {
  isDealer: boolean;
  gameId: string;
  onGameEnd: (winner: string) => void;
}

interface GameState {
  playerHand: string[];
  dealerHand: string[];
  deck: string[];
  currentTurn: 'player' | 'dealer';
  gameOver: boolean;
  winner?: string;
}

export default function Blackjack({ isDealer, gameId, onGameEnd }: BlackjackProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    // Initialize game state when both players are ready
    const initializeGame = () => {
      const deck = createDeck();
      const playerHand = [drawCard(deck), drawCard(deck)];
      const dealerHand = [drawCard(deck), drawCard(deck)];
      
      setGameState({
        playerHand,
        dealerHand,
        deck,
        currentTurn: 'player',
        gameOver: false
      });
    };

    initializeGame();
  }, []);

  const createDeck = () => {
    const suits = ['H', 'D', 'C', 'S'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const deck = [];
    
    for (const suit of suits) {
      for (const value of values) {
        deck.push(`${value}${suit}`);
      }
    }
    
    return shuffle(deck);
  };

  const shuffle = (array: string[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const drawCard = (deck: string[]) => {
    return deck.pop()!;
  };

  const calculateHand = (hand: string[]) => {
    let sum = 0;
    let aces = 0;

    for (const card of hand) {
      const value = card[0];
      if (value === 'A') {
        aces += 1;
        sum += 11;
      } else if (['K', 'Q', 'J'].includes(value)) {
        sum += 10;
      } else {
        sum += parseInt(value);
      }
    }

    while (sum > 21 && aces > 0) {
      sum -= 10;
      aces -= 1;
    }

    return sum;
  };

  if (!gameState) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Dealer's Hand</h3>
        <div className="flex gap-2">
          {gameState.dealerHand.map((card, index) => (
            <Card key={index} card={card} />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Your Hand</h3>
        <div className="flex gap-2">
          {gameState.playerHand.map((card, index) => (
            <Card key={index} card={card} />
          ))}
        </div>
      </div>

      {!gameState.gameOver && gameState.currentTurn === (isDealer ? 'dealer' : 'player') && (
        <div className="flex gap-4">
          <Button
            onClick={() => {
              // Handle hit
            }}
            className="bg-green-500 hover:bg-green-600"
          >
            Hit
          </Button>
          <Button
            onClick={() => {
              // Handle stand
            }}
            className="bg-red-500 hover:bg-red-600"
          >
            Stand
          </Button>
        </div>
      )}
    </div>
  );
} 