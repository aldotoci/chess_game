// const mongoose = require('mongoose');

import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';

connectDB();

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    fromUsername: {
        type: String,
        required: true
    }
});

module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
