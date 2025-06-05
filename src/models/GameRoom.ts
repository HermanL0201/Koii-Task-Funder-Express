import mongoose from 'mongoose';

const gameRoomSchema = new mongoose.Schema({
  creatorId: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  }
});

const GameRoom = mongoose.model('GameRoom', gameRoomSchema);

export default GameRoom;