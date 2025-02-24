'use client';

import { useEffect, useState } from 'react';
import { getGames } from '@/lib/db';
import { Game } from '@/types/game';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      const fetchedGames = await getGames();
      console.log('Fetched games:', fetchedGames); // Log fetched games for testing
      setGames(fetchedGames);
      setLoading(false);
    };

    fetchGames();
  }, []);

  if (loading) {
    return <div>Loading games...</div>;
  }

  if (games.length === 0) {
    return <div>No games available at the moment.</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Available Games</h1>
      <div className="space-y-4">
        {games.map(game => (
          <div key={game.id} className="bg-zinc-800 p-4 rounded">
            <h2 className="text-lg font-semibold">{game.game_type}</h2>
            <p>Created by: {game.username}</p>
            <Link href={`/gameplay/${game.id}`}>
              <Button className="mt-2">Join Game</Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
} 