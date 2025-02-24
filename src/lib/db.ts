import { createClient } from '@supabase/supabase-js'
import { Game } from '@/types/game'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getGames(): Promise<Game[]> {
  console.log('Fetching games from Supabase...');
  const { data, error } = await supabase.from('games').select('*');
  
  if (error) {
    console.error('Error fetching games:', error.message);
    throw new Error(error.message);
  }
  
  console.log('Fetched games:', data);
  return data || [];
}

export async function updateGames(games: Game[]) {
  for (const game of games) {
    const { error } = await supabase.from('games').upsert(game)
    if (error) {
      console.error('Error updating game:', error.message)
    }
  }
}

export async function getGame(id: string): Promise<Game | null> {
  const { data, error, count } = await supabase
    .from('games')
    .select('*', { count: 'exact' })
    .eq('id', id);

  if (error) {
    console.error('Error fetching game:', error.message);
    return null;
  }

  if (count === 0) {
    console.error('No game found with the provided ID.');
    return null;
  }

  if (data.length > 1) {
    console.error('Multiple games found with the same ID.');
    return null;
  }

  return data[0];
}

export async function createGame(game: Game) {
  const { data, error } = await supabase.from('games').insert([game])
  if (error) throw new Error(error.message)
  return data
}

// export const subscribeToGames = (callback: (game: Game) => void) => {
//   return supabase
//     .from('games')
//     .on('*', (payload: { new: Game; old: Game | null }) => {
//       console.log('Change received!', payload);
//       callback(payload.new);
//     })
//     .subscribe();
// }; 