import mongoose from 'mongoose';

export interface Player {
  id: string;
  username: string;
}

export interface GameRoomDocument extends mongoose.Document {
  roomId: string;
  name: string;
  creatorId: string;
  players: Player[];
  maxPlayers: number;
  status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED';
}

const GameRoomSchema = new mongoose.Schema<GameRoomDocument>({
  roomId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  creatorId: { 
    type: String, 
    required: true 
  },
  players: { 
    type: [{
      id: { type: String, required: true },
      username: { type: String, required: true }
    }], 
    default: [] 
  },
  maxPlayers: { 
    type: Number, 
    required: true, 
    default: 4, 
    min: 2, 
    max: 10 
  },
  status: { 
    type: String, 
    enum: ['WAITING', 'IN_PROGRESS', 'COMPLETED'], 
    default: 'WAITING' 
  }
});

export const GameRoom = mongoose.model<GameRoomDocument>('GameRoom', GameRoomSchema);