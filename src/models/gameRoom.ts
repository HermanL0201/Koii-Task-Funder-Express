import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

// Enum for room status
export enum RoomStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CLOSED = 'closed'
}

// Interface for Player Schema
export interface IPlayer {
  username: string;
  userId: string;
  joinedAt: Date;
}

// Interface for Game Room Schema
export interface IGameRoom {
  roomId: string;
  name: string;
  creator: string;
  status: RoomStatus;
  maxPlayers: number;
  currentPlayers: IPlayer[];
  gameType: string;
  createdAt: Date;
  updatedAt: Date;
}

// Game Room Schema
const GameRoomSchema = new mongoose.Schema<IGameRoom>({
  roomId: {
    type: String,
    default: () => nanoid(10),
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: [true, 'Room name is required'],
    trim: true,
    minlength: [3, 'Room name must be at least 3 characters long'],
    maxlength: [50, 'Room name cannot exceed 50 characters']
  },
  creator: {
    type: String,
    required: [true, 'Creator ID is required']
  },
  status: {
    type: String,
    enum: Object.values(RoomStatus),
    default: RoomStatus.WAITING
  },
  maxPlayers: {
    type: Number,
    required: [true, 'Max players is required'],
    min: [2, 'Minimum 2 players required'],
    max: [10, 'Maximum 10 players allowed']
  },
  currentPlayers: {
    type: [{
      username: {
        type: String,
        required: [true, 'Player username is required']
      },
      userId: {
        type: String,
        required: [true, 'Player user ID is required']
      },
      joinedAt: {
        type: Date,
        default: Date.now
      }
    }],
    validate: [
      {
        validator: function(players: IPlayer[]) {
          return players.length <= this.maxPlayers;
        },
        message: 'Number of players cannot exceed max players limit'
      }
    ]
  },
  gameType: {
    type: String,
    required: [true, 'Game type is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Pre-save hook to update updatedAt
GameRoomSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create and export the model
const GameRoom = mongoose.model<IGameRoom>('GameRoom', GameRoomSchema);

export default GameRoom;