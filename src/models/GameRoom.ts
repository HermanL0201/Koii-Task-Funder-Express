import mongoose, { Schema, Document } from 'mongoose';

export interface Player {
  id: string;
}

export interface GameRoomDocument extends Document {
  name: string;
  players: Player[];
  maxPlayers: number;
  status: 'open' | 'in_progress' | 'closed';
}

const GameRoomSchema: Schema = new Schema({
  name: { type: String, required: true },
  players: [{ 
    id: { type: String, required: true } 
  }],
  maxPlayers: { type: Number, default: 4, min: 2, max: 10 },
  status: { 
    type: String, 
    enum: ['open', 'in_progress', 'closed'], 
    default: 'open' 
  }
}, { 
  timestamps: true 
});

const GameRoom = mongoose.model<GameRoomDocument>('GameRoom', GameRoomSchema);

export default GameRoom;