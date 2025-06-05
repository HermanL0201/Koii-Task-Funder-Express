import mongoose, { Schema, Document, Model } from 'mongoose';

// Enum for room status
export enum RoomStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CLOSED = 'closed'
}

// Interface for Player
export interface IPlayer {
  id: string;
  username: string;
}

// Interface for GameRoom document
export interface IGameRoom extends Document {
  roomId: string;
  name: string;
  creator: IPlayer;
  players: IPlayer[];
  maxPlayers: number;
  status: RoomStatus;
  leaveRoom(playerId: string): Promise<IGameRoom>;
}

// Interface for GameRoom model
export interface IGameRoomModel extends Model<IGameRoom> {
  findByRoomId(roomId: string): Promise<IGameRoom | null>;
}

// Game Room Schema
const GameRoomSchema = new Schema<IGameRoom>({
  roomId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  creator: {
    id: { 
      type: String, 
      required: true 
    },
    username: { 
      type: String, 
      required: true 
    }
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
    min: 1 
  },
  status: { 
    type: String, 
    enum: Object.values(RoomStatus), 
    default: RoomStatus.WAITING 
  }
}, {
  timestamps: true
});

// Method to leave room
GameRoomSchema.methods.leaveRoom = async function(playerId: string) {
  // Find the index of the player to remove
  const playerIndex = this.players.findIndex(player => player.id === playerId);

  // If player not found, throw an error
  if (playerIndex === -1) {
    throw new Error('Player not found in this room');
  }

  // Remove the player
  this.players.splice(playerIndex, 1);

  // Check if the room is now empty
  if (this.players.length === 0) {
    this.status = RoomStatus.CLOSED;
  }

  // If the creator leaves, transfer creator status or close room
  if (this.creator.id === playerId) {
    if (this.players.length > 0) {
      // Transfer creator status to the first player
      this.creator = this.players[0];
    } else {
      this.status = RoomStatus.CLOSED;
    }
  }

  // Save and return the updated room
  return this.save();
};

// Static method to find by roomId
GameRoomSchema.statics.findByRoomId = function(roomId: string) {
  return this.findOne({ roomId });
};

// Create and export the model
const GameRoom = mongoose.model<IGameRoom, IGameRoomModel>('GameRoom', GameRoomSchema);

export default GameRoom;