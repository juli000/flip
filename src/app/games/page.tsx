'use client';

import { useEffect, useState } from 'react';
import { getGames } from '@/lib/db';
import { Game } from '@/types/game';

const GamesPage = () => {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const fetchedGames = await getGames();
        setGames(fetchedGames);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  return (
    <div>
      <h1>Games</h1>
      {games.length === 0 ? (
        <p>No games available.</p>
      ) : (
        <ul>
          {games.map(game => (
            <li key={game.id}>{game.gameType} - {game.keys} {game.keyType}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GamesPage; 