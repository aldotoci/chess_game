// models/Game.js

const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    initializer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    opponent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    settings: { type: Map, of: String },
    initializerColor: { type: String, default: 'w'},
    opponentColor: { type: String, default: 'b'},
    status: { type: String, default: 'pending' },
    moves: [{
        from: String,
        to: String,
        piece: String,
        timestamp: { type: Date, default: Date.now },
        notation: String  // Standard chess notation (e.g., "E2 to E4")
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', gameSchema);