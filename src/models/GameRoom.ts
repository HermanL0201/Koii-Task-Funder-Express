import mongoose, { Schema, Document } from 'mongoose';

export interface Player {
  id: string;
  username: string;
}

export interface GameRoomDocument extends Document {
  name: string;
  creatorId: string;
  maxPlayers: number;
  currentPlayers: Player[];
  status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED';
  leaveRoom(playerId: string): Promise<GameRoomDocument>;
}

const GameRoomSchema = new Schema<GameRoomDocument>({
  name: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50 
  },
  creatorId: { 
    type: String, 
    required: true 
  },
  maxPlayers: { 
    type: Number, 
    required: true,
    min: 2,
    max: 10 
  },
  currentPlayers: { 
    type: [{
      id: { type: String, required: true },
      username: { type: String, required: true }
    }],
    default: [] 
  },
  status: {
    type: String,
    enum: ['WAITING', 'IN_PROGRESS', 'COMPLETED'],
    default: 'WAITING'
  }
});

// Method to handle player leaving the room
GameRoomSchema.methods.leaveRoom = async function(playerId: string) {
  // Check if player is in the room
  const playerIndex = this.currentPlayers.findIndex(p => p.id === playerId);
  
  if (playerIndex === -1) {
    throw new Error('Player not found in the room');
  }

  // Remove the player
  this.currentPlayers.splice(playerIndex, 1);

  // If room is empty, mark as completed
  if (this.currentPlayers.length === 0) {
    this.status = 'COMPLETED';
  }

  // Save changes
  return await this.save();
};

const GameRoom = mongoose.model<GameRoomDocument>('GameRoom', GameRoomSchema);

export default GameRoom;