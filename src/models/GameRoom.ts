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
  
  // Method to check if a player can join
  canJoin(): boolean;
  
  // Method to add a player
  addPlayer(player: Player): boolean;
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

// Check if room is full or closed
GameRoomSchema.methods.canJoin = function() {
  return this.players.length < this.maxPlayers && this.status === 'open';
};

// Add a player to the room
GameRoomSchema.methods.addPlayer = function(player: Player) {
  // Check if the player is already in the room
  const isPlayerAlreadyInRoom = this.players.some(p => p.id === player.id);
  
  // Can only join if room is open, not full, and player is not already in room
  if (this.canJoin() && !isPlayerAlreadyInRoom) {
    this.players.push(player);
    return true;
  }
  return false;
};

export const GameRoom = mongoose.model<GameRoomDocument>('GameRoom', GameRoomSchema);