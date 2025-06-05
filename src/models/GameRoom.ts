import mongoose, { Schema, Document, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Enum for possible room statuses
export enum RoomStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Interface for Player
export interface IPlayer {
  id: string;
  username: string;
  isCreator: boolean;
}

// Game Room Document Interface
export interface IGameRoom extends Document {
  roomId: string;
  name: string;
  creator: IPlayer;
  status: RoomStatus;
  players: IPlayer[];
  maxPlayers: number;
  currentPlayerCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Game Room Schema
const GameRoomSchema: Schema = new Schema({
  roomId: {
    type: String,
    unique: true,
    default: () => uuidv4(),
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
    type: {
      id: {
        type: String,
        required: true
      },
      username: {
        type: String,
        required: true
      },
      isCreator: {
        type: Boolean,
        default: true
      }
    },
    required: true
  },
  status: {
    type: String,
    enum: Object.values(RoomStatus),
    default: RoomStatus.WAITING
  },
  players: {
    type: [{
      id: {
        type: String,
        required: true
      },
      username: {
        type: String,
        required: true
      },
      isCreator: {
        type: Boolean,
        default: false
      }
    }],
    validate: [
      {
        validator: function(this: IGameRoom, players: IPlayer[]) {
          return players.length <= this.maxPlayers;
        },
        message: 'Exceeded maximum number of players'
      }
    ]
  },
  maxPlayers: {
    type: Number,
    required: true,
    min: [2, 'Minimum 2 players required'],
    max: [10, 'Maximum 10 players allowed']
  },
  currentPlayerCount: {
    type: Number,
    default: 1,
    min: 1
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Middleware to update currentPlayerCount before save
GameRoomSchema.pre('save', function(next) {
  this.currentPlayerCount = this.players.length;
  next();
});

// Create the model
const GameRoom: Model<IGameRoom> = mongoose.model<IGameRoom>('GameRoom', GameRoomSchema);

export default GameRoom;