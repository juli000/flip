'use client'; // Ensure this is at the top if using hooks

import { createGame } from '@/lib/db';
import { Game } from '@/types/game';
import { useState } from 'react';

const CreateGamePage = () => {
  const [gameData, setGameData] = useState<Game>({
    id: undefined, // This is now valid since id is optional
    gameType: '',
    keys: 0,
    keyType: '',
    username: '',
    createdAt: new Date(), // Set to current date
    participants: [], // Initialize if needed
    paidParticipants: [], // Initialize if needed
    gameStartTime: undefined, // Initialize if needed
    confirmedPayments: [], // Initialize if needed
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
        name="gameType"
        value={gameData.gameType}
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
        name="keyType"
        value={gameData.keyType}
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