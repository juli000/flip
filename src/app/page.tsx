'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { images } from '@/assets/images';

interface Game {
  id: string;
  gameType: string;
  keys: number;
  keyType: string;
  createdAt: Date;
  username?: string;
  participants: string[];
}

export default function HomePage() {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    // Load games from localStorage only
    const storedGames = JSON.parse(localStorage.getItem('games') || '[]');
    setGames(storedGames);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">DnDFlips</h1>
          <Link 
            href="/create-games"
            className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-md"
          >
            Create Game
          </Link>
        </div>

        <div className="flex flex-col space-y-4">
          {games.map((game) => (
            <Card key={game.id} className="bg-zinc-900 p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className="flex items-center justify-center w-16 h-16">
                    {game.keyType === 'skull' ? (
                      <Image
                        src={images.skullKey}
                        alt="Skull Key"
                        width={48}
                        height={48}
                        className="object-contain"
                        priority
                      />
                    ) : (
                      <Image
                        src={images.goldKey}
                        alt="Gold Key"
                        width={64}
                        height={64}
                        className="object-contain"
                        priority
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold capitalize">{game.gameType}</h3>
                    <p className="text-gray-400">
                      by {game.username || 'Anonymous'}
                    </p>
                    <p className="text-gray-400">
                      {game.keys} {game.keyType} keys
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    {new Date(game.createdAt).toLocaleDateString()}
                  </span>
                  <Link href={`/gameplay/${game.id}`}>
                    <Button 
                      className={
                        game.participants && game.participants.length >= 2
                          ? "bg-white text-black hover:bg-gray-200"
                          : "bg-zinc-700 hover:bg-zinc-600"
                      }
                    >
                      {game.participants && game.participants.length >= 2 
                        ? "View Game" 
                        : "Join Game"
                      }
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
