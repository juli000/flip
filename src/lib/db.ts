import { createClient } from '@supabase/supabase-js'
import { Game } from '@/types/game'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function getGames(): Promise<Game[]> {
  const { data, error } = await supabase.from('games').select('*')
  if (error) throw new Error(error.message)
  console.log('Fetched games:', data)
  return data || []
}

export async function updateGames(games: Game[]) {
  for (const game of games) {
    await supabase.from('games').upsert(game)
  }
}

export async function getGame(id: string | string[]): Promise<Game | null> {
  if (Array.isArray(id)) return null
  const { data } = await supabase.from('games').select('*').eq('id', id).single()
  return data
}

export async function createGame(game: Game) {
  const { data, error } = await supabase.from('games').insert([{
    game_type: game.gameType,
    keys: game.keys,
    key_type: game.keyType,
    username: game.username,
  }]);
  if (error) throw new Error(error.message);
  return data;
} 