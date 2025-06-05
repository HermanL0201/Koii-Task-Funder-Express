import mongoose from 'mongoose';

const GameRoomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  players: [{
    type: String,
    trim: true
  }],
  maxPlayers: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  status: {
    type: String,
    enum: ['waiting', 'in_progress', 'completed'],
    default: 'waiting'
  }
}, {
  timestamps: true
});

export const GameRoom = mongoose.model('GameRoom', GameRoomSchema);