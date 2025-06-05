import mongoose from 'mongoose';

const GameRoomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  players: [{
    playerId: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    }
  }],
  maxPlayers: {
    type: Number,
    required: true,
    min: [1, 'Room must allow at least 1 player'],
    max: [10, 'Room cannot exceed 10 players']
  },
  status: {
    type: String,
    enum: ['WAITING', 'IN_PROGRESS', 'COMPLETED'],
    default: 'WAITING'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  methods: {
    // Method to handle a player leaving the room
    leaveRoom(playerId) {
      // Remove the player from the players array
      this.players = this.players.filter(player => player.playerId !== playerId);

      // If no players are left, update the status
      if (this.players.length === 0) {
        this.status = 'COMPLETED';
      }

      return this;
    }
  }
});

// Ensure players cannot exceed max limit during join/add operations
GameRoomSchema.pre('save', function(next) {
  if (this.players.length > this.maxPlayers) {
    return next(new Error('Room has reached maximum player limit'));
  }
  next();
});

const GameRoom = mongoose.model('GameRoom', GameRoomSchema);

export default GameRoom;