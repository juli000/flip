export interface Game {
  id?: string;
  gameType: string;
  keys: number;
  keyType: string;
  createdAt: Date;
  username: string;
  participants?: string[];
  paidParticipants?: string[];
  gameStartTime?: number;
  confirmedPayments?: string[];
} 