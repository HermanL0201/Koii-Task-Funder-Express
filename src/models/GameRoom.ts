import mongoose from 'mongoose';

const GameRoomSchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  // Add other necessary fields
});

export const GameRoom = mongoose.model('GameRoom', GameRoomSchema);