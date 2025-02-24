'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Game {
  id: string;
  gameType: string;
  keys: number;
  keyType: string;
  createdAt: Date;
  username: string;
  participants?: string[];
  paidParticipants?: string[];
  gameStartTime?: number; // Unix timestamp when second player paid
  confirmedPayments?: string[];
}

function calculateTax(keys: number, keyType: string) {
  if (keyType === 'skull') {
    const goldKeyTax = Math.floor(keys / 4);
    return {
      goldKeys: goldKeyTax,
      purpleGems: 0
    };
  } else if (keyType === 'gold') {
    return {
      goldKeys: 0,
      purpleGems: keys // 1 purple gem per gold key
    };
  }
  return { goldKeys: 0, purpleGems: 0 };
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const gameId = searchParams.get('gameId');
  const [game, setGame] = useState<Game | null>(null);
  const [username, setUsername] = useState('');
  const isCreator = searchParams.get('isCreator') === 'true';
  const [hasSentPayment, setHasSentPayment] = useState(false);

  useEffect(() => {
    const storedGames = JSON.parse(localStorage.getItem('games') || '[]');
    const foundGame = storedGames.find((g: Game) => g.id === gameId);
    setGame(foundGame || null);
    // Set username from game if creator
    if (isCreator && foundGame?.username) {
      setUsername(foundGame.username);
    }
  }, [gameId, isCreator]);

  // Add polling effect to check for payment confirmation
  useEffect(() => {
    const checkPaymentStatus = () => {
      const storedGames = JSON.parse(localStorage.getItem('games') || '[]');
      const currentGame = storedGames.find((g: Game) => g.id === gameId);
      if (currentGame) {
        setGame(currentGame);
      }
    };

    // Check every 2 seconds
    const interval = setInterval(checkPaymentStatus, 2000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [gameId]);

  const handleSendPayment = () => {
    if (!username.trim()) {
      alert('Please enter your username');
      return;
    }

    const storedGames = JSON.parse(localStorage.getItem('games') || '[]');
    const gameIndex = storedGames.findIndex((g: Game) => g.id === gameId);
    
    if (gameIndex !== -1) {
      const updatedGames = [...storedGames];
      const currentGame = updatedGames[gameIndex];
      
      // Add user to participants list
      if (!currentGame.participants?.includes(username)) {
        if (!currentGame.participants) {
          currentGame.participants = [];
        }
        currentGame.participants.push(username);
      }

      localStorage.setItem('games', JSON.stringify(updatedGames));
      setHasSentPayment(true);
    }
  };

  const handleConfirmJoin = () => {
    if (!isCreator && !username.trim()) {
      alert('Please enter your username');
      return;
    }

    const storedGames = JSON.parse(localStorage.getItem('games') || '[]');
    const gameIndex = storedGames.findIndex((g: Game) => g.id === gameId);
    
    if (gameIndex !== -1) {
      const updatedGames = [...storedGames];
      const currentGame = updatedGames[gameIndex];
      
      // Only update participants if not already in the game
      if (!currentGame.participants?.includes(username)) {
        if (!currentGame.participants) {
          currentGame.participants = [];
        }
        currentGame.participants.push(username);
      }

      localStorage.setItem('games', JSON.stringify(updatedGames));
      router.push(`/gameplay/${gameId}`);
    }
  };

  const isPaymentConfirmed = game?.confirmedPayments?.includes(username);

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Game not found</h1>
          <Link href="/">
            <Button className="bg-blue-500 hover:bg-blue-600">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const tax = calculateTax(game.keys, game.keyType);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <Card className="bg-zinc-900 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isCreator ? 'Complete Payment' : 'Join Game'}
          </h1>
          <p className="text-gray-400">
            {isCreator ? 'Send the required items' : 'Enter your details and send the required items'}
          </p>
        </div>

        <div className="space-y-6">
          {!isCreator && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">Your In-Game Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-zinc-800 rounded-md p-2 border-0 shadow-inner text-white"
                required
                placeholder="Enter your in-game name"
                maxLength={20}
              />
            </div>
          )}

          <div className="bg-zinc-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Instructions</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 mb-2">Send your items to:</p>
                <p className="text-lg font-medium text-white">DnDFlips Bot</p>
              </div>
              <div>
                <p className="text-gray-400 mb-2">Include this code in trade message:</p>
                <p className="bg-zinc-700 p-2 rounded text-center font-mono">
                  {game.id}
                </p>
              </div>
              <div className="bg-zinc-700/50 p-4 rounded-lg space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Required Payment:</h3>
                  <p className="text-white">
                    {game.keyType === 'gold' ? (
                      <span className="text-yellow-500">{game.keys} Gold Keys</span>
                    ) : (
                      `${game.keys} Skull Keys`
                    )}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Required Tax:</h3>
                  <div className="space-y-1">
                    {tax.goldKeys > 0 && (
                      <p className="text-white">
                        + <span className="text-yellow-500">{tax.goldKeys} gold</span> {tax.goldKeys === 1 ? 'key' : 'keys'} (1 per 4 skull keys)
                      </p>
                    )}
                    {tax.purpleGems > 0 && (
                      <p className="text-purple-400">
                        + {tax.purpleGems} epic rarity {tax.purpleGems === 1 ? 'gem' : 'gems'} (any gem)
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-2 text-xs text-gray-500">
                  Note: Tax must be included with your payment or the trade will be rejected
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            {isCreator ? (
              // Creator flow - waiting for verification
              isPaymentConfirmed ? (
                <Button 
                  onClick={handleConfirmJoin}
                  className="w-full bg-white text-black hover:bg-gray-200"
                >
                  Continue to Game
                </Button>
              ) : (
                <>
                  <p className="text-gray-400 text-center w-full mb-4">
                    Please send the required items. An admin will verify your payment.
                  </p>
                  <Button 
                    className="w-full bg-zinc-700 hover:bg-zinc-600"
                    disabled={true}
                  >
                    Waiting for Payment Verification
                  </Button>
                </>
              )
            ) : (
              // Joiner flow - must send payment first
              !hasSentPayment ? (
                <Button 
                  onClick={handleSendPayment}
                  className="w-full bg-white text-black hover:bg-gray-200"
                >
                  Send Payment
                </Button>
              ) : isPaymentConfirmed ? (
                <Button 
                  onClick={handleConfirmJoin}
                  className="w-full bg-white text-black hover:bg-gray-200"
                >
                  Continue to Game
                </Button>
              ) : (
                <>
                  <p className="text-gray-400 text-center w-full mb-4">
                    Please wait while your payment is verified.
                  </p>
                  <Button 
                    className="w-full bg-zinc-700 hover:bg-zinc-600"
                    disabled={true}
                  >
                    Waiting for Verification
                  </Button>
                </>
              )
            )}
            <Button className="bg-zinc-700 hover:bg-zinc-600">
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
        <Card className="bg-zinc-900 p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          </div>
        </Card>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
} 