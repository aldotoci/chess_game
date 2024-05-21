// models/User.js

// const mongoose = require('mongoose');
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';

connectDB()

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    dateOfCreation: {
        type: Date,
        default: Date.now
    },
    wins: {
        type: Number,
        default: 0
    },
    losses: {
        type: Number,
        default: 0
    },
    gamesPlayed: {
        type: Number,
        default: 0
    },
    currentRating: {
        type: Number,
        default: 1000 // Default rating can be adjusted
    },
    gameHistory: [
        {
            opponent: String,
            outcome: String, // Win, Loss, Draw
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ],
    achievements: [
        {
            name: String,
            description: String,
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ],
    profilePicture: {
        type: String,
        default: 'https://example.com/default-profile-picture.jpg'
    },
    preferredOpening: {
        type: String,
        default: 'Sicilian Defense' // Default opening can be adjusted
    },
    bio: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: 'Unknown'
    },
    lastOnline: {
        type: Date,
        default: Date.now
    },
    sendFriendRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    addFriendRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    notifications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Notification'
        }
    ]
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
