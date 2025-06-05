import mongoose from 'mongoose';

export interface Player {
  id: string;
  username: string;
}

export interface GameRoomDocument extends mongoose.Document {
  roomId: string;
  name: string;
  players: Player[];
  maxPlayers: number;
  status: 'open' | 'in_progress' | 'closed';
  createdBy: string;
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
  players: [{
    id: { 
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
    min: 1,
    max: 10 
  },
  status: { 
    type: String, 
    enum: ['open', 'in_progress', 'closed'], 
    default: 'open' 
  },
  createdBy: { 
    type: String, 
    required: true 
  }
}, {
  timestamps: true
});

// Check if room is full before adding a player
GameRoomSchema.methods.canJoin = function() {
  return this.players.length < this.maxPlayers && this.status === 'open';
};

// Add a player to the room
GameRoomSchema.methods.addPlayer = function(player: Player) {
  if (this.canJoin()) {
    this.players.push(player);
    return true;
  }
  return false;
};

export const GameRoom = mongoose.model<GameRoomDocument>('GameRoom', GameRoomSchema);