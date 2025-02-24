'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getGame, updateGames } from '@/lib/db';
import { Game } from '@/types/game';

export default function GameplayPage() {
  const params = useParams();
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const fetchGame = async () => {
      if (!params.id) return;
      const gameData = await getGame(params.id);
      if (gameData) setGame(gameData);
    };
    fetchGame();

    // Poll for updates
    const interval = setInterval(fetchGame, 1000);
    return () => clearInterval(interval);
  }, [params.id]);

  useEffect(() => {
    const checkForUpdates = () => {
      const storedGames = JSON.parse(localStorage.getItem('games') || '[]');
      const currentGame = storedGames.find((g: Game) => g.id === params.id);
      setGame(currentGame || null);

      // Start countdown when both payments are confirmed and game hasn't started
      if (currentGame?.confirmedPayments?.length === 2 && !hasStarted) {
        setCountdown(30);
        setHasStarted(true);
      }
    };

    checkForUpdates();
    const interval = setInterval(checkForUpdates, 1000);
    return () => clearInterval(interval);
  }, [params.id, hasStarted]);

  // Separate effect for countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (countdown !== null && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => (prev !== null && prev > 0) ? prev - 1 : null);
      }, 1000);
    } else if (countdown === 0) {
      const storedGames = JSON.parse(localStorage.getItem('games') || '[]');
      const updatedGames = storedGames.filter((g: Game) => g.id !== params.id);
      localStorage.setItem('games', JSON.stringify(updatedGames));
      router.push('/');
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown, params.id, router]);

  const handleJoinGame = () => {
    router.push(`/confirmation?gameId=${game?.id}`);
  };

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Game not found</h1>
          <Link href="/">
            <Button className="bg-white text-black hover:bg-gray-200">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isPaymentConfirmed = game.confirmedPayments?.includes(game.username);
  const isGameFull = game.participants && game.participants.length >= 2;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">
            {game.gameType.charAt(0).toUpperCase() + game.gameType.slice(1)} Game
          </h1>
          <Button className="bg-zinc-700 hover:bg-zinc-600">Exit Game</Button>
        </div>

        <Card className="bg-zinc-900 p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold mb-2">
              {!isPaymentConfirmed 
                ? 'Waiting for payment verification...'
                : game.confirmedPayments?.length === 2 
                  ? 'Game Starting...' 
                  : game.participants?.length === 2 
                    ? 'Waiting for opponent payment confirmation...'
                    : 'Waiting for opponent...'}
            </h2>
            {countdown !== null && (
              <p className="text-xl font-bold text-red-500">
                Game starts in: {countdown}s
              </p>
            )}
            <div className="space-y-2">
              <p className="text-gray-400">
                Created by <span className="text-white">{game.username}</span>
              </p>
              <p className="text-gray-400">
                {game.keys} {game.keyType === 'skull' ? 'Skull Keys' : 'Gold Keys'} at stake
              </p>
              <p className="text-sm text-gray-500">
                Created on {new Date(game.createdAt).toLocaleDateString()} at{' '}
                {new Date(game.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div className="mb-8 bg-zinc-800 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-3">Players</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{game.username} (Host)</span>
                </div>
                {game.confirmedPayments?.includes(game.username) ? (
                  <span className="text-green-500 text-sm">Payment Confirmed ✓</span>
                ) : (
                  <span className="text-yellow-500 text-sm">Awaiting Confirmation</span>
                )}
              </div>
              {game.participants && game.participants.length > 1 ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{game.participants[game.participants.length - 1]}</span>
                  </div>
                  {game.confirmedPayments?.includes(game.participants[game.participants.length - 1]) ? (
                    <span className="text-green-500 text-sm">Payment Confirmed ✓</span>
                  ) : (
                    <span className="text-yellow-500 text-sm">Awaiting Confirmation</span>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-gray-400">Waiting for opponent...</span>
                </div>
              )}
            </div>
          </div>

          {!isGameFull && !isPaymentConfirmed && (
            <div className="text-center py-4">
              <p className="text-gray-400 mb-4">
                Your payment is being verified by an admin. Please wait...
              </p>
              <Button 
                className="bg-zinc-700 hover:bg-zinc-600"
                disabled={true}
              >
                Waiting for Verification
              </Button>
            </div>
          )}

          {!isGameFull && isPaymentConfirmed && (
            <div className="flex justify-center">
              <Button 
                onClick={handleJoinGame}
                className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg"
              >
                Join Game Now
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
} 