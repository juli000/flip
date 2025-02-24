'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { images } from '@/assets/images';

interface Game {
  id: string;
  gameType: string;
  keys: number;
  keyType: string;
  createdAt: Date;
  username?: string;
  participants: string[];
  paidParticipants?: string[];
  gameStartTime?: number;
  confirmedPayments?: string[];
}

const ADMIN_PASSWORD = "bruh"; // In production, this should be in environment variables

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const checkForUpdates = () => {
      const storedGames = JSON.parse(localStorage.getItem('games') || '[]');
      setGames(storedGames);
    };

    // Initial check
    checkForUpdates();

    // Check every second for updates
    const interval = setInterval(checkForUpdates, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
    } else {
      alert('Invalid password');
    }
  };

  const handleDeleteGame = (gameId: string) => {
    const updatedGames = games.filter(game => game.id !== gameId);
    localStorage.setItem('games', JSON.stringify(updatedGames));
    setGames(updatedGames);
  };

  const handleConfirmPayment = (gameId: string, playerName: string) => {
    if (!playerName) return;
    
    const updatedGames = games.map(game => {
      if (game.id === gameId) {
        // Only add this specific player to confirmed payments
        const newConfirmedPayments = [...(game.confirmedPayments || [])];
        if (!newConfirmedPayments.includes(playerName)) {
          newConfirmedPayments.push(playerName);
        }
        
        // Set game start time only when both players exist AND both payments are confirmed
        const shouldStartGame = game.participants.length === 2 && newConfirmedPayments.length === 2;
        
        return {
          ...game,
          confirmedPayments: newConfirmedPayments,
          gameStartTime: shouldStartGame ? Date.now() : game.gameStartTime
        };
      }
      return game;
    });

    localStorage.setItem('games', JSON.stringify(updatedGames));
    setGames(updatedGames);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <Card className="bg-zinc-900 p-8">
          <h1 className="text-2xl font-bold mb-6 text-center text-white">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-800 rounded-md p-2 border-0 shadow-inner text-white"
                placeholder="Enter admin password"
              />
            </div>
            <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200">
              Login
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <Card className="bg-zinc-900 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <Button className="bg-zinc-700 hover:bg-zinc-600">Logout</Button>
        </div>

        <div className="p-3 bg-zinc-800 rounded">
          <div className="space-y-4">
            {games.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No active games at the moment
              </div>
            ) : (
              games.map((game) => (
                <Card key={game.id} className="bg-zinc-900 p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {game.gameType} - {game.keyType === 'gold' ? (
                          <><span className="text-yellow-500">{game.keys} Gold Keys</span></>
                        ) : (
                          `${game.keys} Skull Keys`
                        )}
                      </h3>
                      <p className="text-gray-400">Game ID: {game.id}</p>
                      <div className="mt-4 space-y-3">
                        {/* Host Payment Section */}
                        <div className="p-3 bg-zinc-800 rounded">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{game.username} (Host)</p>
                              <p className="text-sm text-gray-400">Payment Status:</p>
                            </div>
                            {game.username && (
                              <Button
                                onClick={() => game.username && handleConfirmPayment(game.id, game.username)}
                                className={
                                  game.confirmedPayments?.includes(game.username)
                                    ? "bg-white text-black hover:bg-gray-200"
                                    : "bg-zinc-700 hover:bg-zinc-600"
                                }
                                disabled={!game.username || game.confirmedPayments?.includes(game.username)}
                              >
                                {game.confirmedPayments?.includes(game.username)
                                  ? "Payment Verified ✓"
                                  : "Verify Payment"}
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Opponent Payment Section */}
                        {game.participants.length > 1 && (
                          <div className="p-3 bg-zinc-800 rounded">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{game.participants[1]}</p>
                                <p className="text-sm text-gray-400">Payment Status:</p>
                              </div>
                              <Button
                                onClick={() => handleConfirmPayment(game.id, game.participants[1])}
                                className={
                                  game.confirmedPayments?.includes(game.participants[1])
                                    ? "bg-white text-black hover:bg-gray-200"
                                    : "bg-zinc-700 hover:bg-zinc-600"
                                }
                                disabled={game.confirmedPayments?.includes(game.participants[1])}
                              >
                                {game.confirmedPayments?.includes(game.participants[1])
                                  ? "Payment Verified ✓"
                                  : "Verify Payment"}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 p-3 bg-zinc-700/50 rounded">
                        <p className="text-sm font-mono bg-zinc-700 p-2 rounded text-center">
                          {game.id}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Players must include this code with their payment
                        </p>
                      </div>

                      <p className="text-gray-400">
                        Players: {game.participants.join(', ')} ({game.paidParticipants?.length || 0} paid)
                      </p>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(game.createdAt).toLocaleString()}
                      </p>
                      {game.gameStartTime && (
                        <p className="text-sm text-gray-500">
                          Started: {new Date(game.gameStartTime).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleDeleteGame(game.id)}
                        className="bg-zinc-700 hover:bg-zinc-600"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  );
} 