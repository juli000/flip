'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface Game {
  id: string;
  gameType: 'coinflip';
  keys: number;
  keyType: string;
  createdAt: Date;
  username?: string;
  participants: string[];
  choice: 'heads' | 'tails';
}

// Add tax calculation function
const calculateTax = (keys: number, keyType: string) => {
  if (keyType === 'skull') {
    return Math.floor(keys / 4); // 1 gold key per 4 skull keys
  }
  return 0;
};

export default function CreateGame() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    keys: '',
    keyType: 'gold',
    choice: 'heads' as 'heads' | 'tails',
    username: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      alert('Please enter your username');
      return;
    }

    const newGame: Game = {
      id: Math.random().toString(36).substr(2, 9),
      gameType: 'coinflip',
      keys: Number(formData.keys),
      keyType: formData.keyType,
      createdAt: new Date(),
      participants: [formData.username],
      username: formData.username,
      choice: formData.choice
    };

    const existingGames = JSON.parse(localStorage.getItem('games') || '[]');
    localStorage.setItem('games', JSON.stringify([...existingGames, newGame]));

    router.push(`/confirmation?gameId=${newGame.id}&isCreator=true`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const tax = calculateTax(Number(formData.keys), formData.keyType);

  return (
    <div className="min-h-screen bg-black text-white p-6 flex items-center">
      <div className="max-w-2xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-8 text-center text-white">Create New Game</h1>
        
        <Card className="bg-zinc-900 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">In-Game Name</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-zinc-800 rounded-md p-2 border-0 shadow-inner text-white"
                required
                placeholder="Enter your in-game name"
                maxLength={20}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Your Call</label>
              <select
                name="choice"
                value={formData.choice}
                onChange={handleChange}
                className="w-full bg-zinc-800 rounded-md p-2 border-0 shadow-inner text-white"
              >
                <option value="heads">Heads</option>
                <option value="tails">Tails</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Number of Keys</label>
                <input
                  type="number"
                  name="keys"
                  value={formData.keys}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 rounded-md p-2 border-0 shadow-inner text-white"
                  required
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Key Type</label>
                <select
                  name="keyType"
                  value={formData.keyType}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 rounded-md p-2 border-0 shadow-inner text-white appearance-none"
                >
                  <option value="gold">Gold Keys</option>
                  <option value="skull">Skull Keys</option>
                </select>
              </div>
            </div>

            {formData.keyType === 'skull' && Number(formData.keys) >= 4 && (
              <div className="bg-zinc-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Required Tax:</p>
                <p className="text-white">
                  + {tax} gold {tax === 1 ? 'key' : 'keys'} (1 per 4 skull keys)
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <Button 
                type="button"
                className="w-full bg-zinc-700 hover:bg-zinc-600"
                onClick={() => router.push('/')}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-200"
              >
                Create Game
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
} 