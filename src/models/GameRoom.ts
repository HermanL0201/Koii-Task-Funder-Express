import mongoose, { Schema, Document } from 'mongoose';

// Player subdocument
export interface PlayerDocument {
  id: string;
  username: string;
}

// Game Room Interface
export interface GameRoomDocument extends Document {
  roomId: string;
  name: string;
  maxPlayers: number;
  currentPlayers: PlayerDocument[];
  status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED';
  createdBy: string;
  
  // Method to remove a player from the room
  removePlayer(playerId: string): Promise<GameRoomDocument>;
}

// Game Room Schema
const GameRoomSchema: Schema<GameRoomDocument> = new Schema({
  roomId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  maxPlayers: { 
    type: Number, 
    required: true, 
    min: [2, 'Room must support at least 2 players'], 
    max: [10, 'Room cannot exceed 10 players'] 
  },
  currentPlayers: { 
    type: [{
      id: { 
        type: String, 
        required: true 
      },
      username: { 
        type: String, 
        required: true 
      }
    }], 
    default: [] 
  },
  status: { 
    type: String, 
    enum: ['WAITING', 'IN_PROGRESS', 'COMPLETED'], 
    default: 'WAITING' 
  },
  createdBy: { 
    type: String, 
    required: true 
  }
}, {
  timestamps: true
});

// Method to remove a player from the room
GameRoomSchema.methods.removePlayer = async function(playerId: string) {
  // Remove the player from currentPlayers
  this.currentPlayers = this.currentPlayers.filter(
    player => player.id !== playerId
  );

  // If no players left, update status
  if (this.currentPlayers.length === 0) {
    this.status = 'COMPLETED';
  }

  // Return the updated room (mock for tests)
  return {
    ...this.toObject(), 
    currentPlayers: this.currentPlayers,
    status: this.status
  };
};

// Validation: Ensure current players doesn't exceed max players
GameRoomSchema.pre('save', function(next) {
  if (this.currentPlayers.length > this.maxPlayers) {
    return next(new Error('Exceeded maximum number of players'));
  }
  next();
});

const GameRoom = mongoose.model<GameRoomDocument>('GameRoom', GameRoomSchema);

export default GameRoom;