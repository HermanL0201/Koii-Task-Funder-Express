import mongoose from 'mongoose';
import { GameRoomStatus } from '../types/GameRoomStatus';

const GameRoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  maxPlayers: { type: Number, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: Object.values(GameRoomStatus), 
    default: GameRoomStatus.WAITING 
  },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const GameRoom = mongoose.model('GameRoom', GameRoomSchema);

export default GameRoom;