import mongoose from 'mongoose';

// Define player schema
const playerSchema = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, required: true }
});

const gameRoomSchema = new mongoose.Schema({
  creatorId: { type: String, required: true },
  currentPlayers: [playerSchema],
  maxPlayers: { type: Number, default: 4, min: 1, max: 8 },
  status: { 
    type: String, 
    enum: ['pending', 'in_progress', 'COMPLETED', 'cancelled'],
    default: 'pending'
  }
}, {
  methods: {
    addPlayer(player: { id: string, username: string }) {
      if (this.currentPlayers.length >= this.maxPlayers) {
        throw new Error('Room is full');
      }
      
      // Prevent duplicate players
      const existingPlayer = this.currentPlayers.find(p => p.id === player.id);
      if (!existingPlayer) {
        this.currentPlayers.push(player);
      }
      
      return this;
    },

    removePlayer(playerId: string) {
      const initialLength = this.currentPlayers.length;
      this.currentPlayers = this.currentPlayers.filter(p => p.id !== playerId);
      
      // Update status to COMPLETED if last player leaves
      if (this.currentPlayers.length === 0) {
        this.status = 'COMPLETED';
      }
      
      return this;
    }
  }
});

const GameRoom = mongoose.model('GameRoom', gameRoomSchema);

export default GameRoom;