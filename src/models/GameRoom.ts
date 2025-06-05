import mongoose, { Schema, Document } from 'mongoose';

export interface IGameRoom extends Document {
  name: string;
  maxPlayers: number;
  players: mongoose.Types.ObjectId[];
  status: 'waiting' | 'in_progress' | 'completed';
  createdAt: Date;
}

const GameRoomSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  maxPlayers: { 
    type: Number, 
    required: true, 
    min: [2, 'Room must support at least 2 players'], 
    max: [10, 'Room cannot support more than 10 players'] 
  },
  players: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  status: { 
    type: String, 
    enum: ['waiting', 'in_progress', 'completed'], 
    default: 'waiting' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const GameRoom = mongoose.model<IGameRoom>('GameRoom', GameRoomSchema);

export default GameRoom;