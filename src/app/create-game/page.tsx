import { createGame } from '@/lib/db';
import { Game } from '@/types/game';

const handleSubmit = async (gameData: Game) => {
  try {
    const newGame = await createGame(gameData);
    console.log('Game created:', newGame);
  } catch (error) {
    console.error('Error creating game:', error);
  }
}; 