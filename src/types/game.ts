export interface Game {
  id: string;
  game_type: string;
  keys: number;
  key_type: string;
  created_at: string;
  username: string;
  participants: string[];
  paid_participants: string[];
  game_start_time: string;
  confirmed_payments: string[];
} 