import mongoose from 'mongoose';

// Define player schema
const playerSchema = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, required: true }
});

const gameRoomSchema = new mongoose.Schema({
  creatorId: { type: String, required: true },
  players: [playerSchema],
  maxPlayers: { type: Number, default: 4, min: 1, max: 8 },
  status: { 
    type: String, 
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  }
}, {
  methods: {
    addPlayer(player: { id: string, username: string }) {
      if (this.players.length >= this.maxPlayers) {
        throw new Error('Room is full');
      }
      
      // Prevent duplicate players
      const existingPlayer = this.players.find(p => p.id === player.id);
      if (!existingPlayer) {
        this.players.push(player);
      }
      
      return this;
    },

    removePlayer(playerId: string) {
      const initialLength = this.players.length;
      this.players = this.players.filter(p => p.id !== playerId);
      
      // Update status to completed if last player leaves
      if (this.players.length === 0) {
        this.status = 'completed';
      }
      
      return this;
    }
  }
});

const GameRoom = mongoose.model('GameRoom', gameRoomSchema);

export default GameRoom;