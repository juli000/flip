'use client'; // Ensure this is at the top if using hooks

import { createGame } from '@/lib/db';
import { Game } from '@/types/game';
import { useState } from 'react';

const CreateGamePage = () => {
  const [gameData, setGameData] = useState<Game>({
    id: '', // Change this to an empty string or a valid UUID
    game_type: '',
    keys: 0,
    key_type: '',
    username: '',
    created_at: new Date().toISOString(), // Set to current date in ISO format
    participants: [], // Initialize if needed
    paid_participants: [], // Initialize if needed
    game_start_time: '',
    confirmed_payments: [], // Initialize if needed
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newGame = await createGame(gameData);
      console.log('Game created:', newGame);
    } catch (error) {
      console.error('Error creating game:', error);
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGameData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Example form usage
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="game_type"
        value={gameData.game_type}
        onChange={handleChange}
        placeholder="Game Type"
      />
      <input
        type="number"
        name="keys"
        value={gameData.keys}
        onChange={handleChange}
        placeholder="Number of Keys"
      />
      <input
        type="text"
        name="key_type"
        value={gameData.key_type}
        onChange={handleChange}
        placeholder="Key Type"
      />
      <input
        type="text"
        name="username"
        value={gameData.username}
        onChange={handleChange}
        placeholder="Username"
      />
      <button type="submit">Create Game</button>
    </form>
  );
};

export default CreateGamePage; 