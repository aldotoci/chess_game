// pages/api/new-game.js
import dbConnect from '../../lib/mongodb';
import Game from '../../models/Game';
import Notification from '@/models/Notifications';
import User from '@/models/User';
import { getServerSession  } from 'next-auth/next';
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export default async function handler(req, res) {
    if (req.method === 'POST') {
        await dbConnect();
        const session = await getServerSession(req, res, authOptions);

        if (!session) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const initializer = session.user._id;
            const {opponent} = req.body


            // Get the initilizer color randomly 0 or 1
            const randomColor = Math.floor(Math.random() * 2);
            const initializerColor = randomColor === 0 ? 'w' : 'b';
            const opponentColor = initializerColor === 'w' ? 'b' : 'w';
            
            const newGame = new Game({
                initializer,
                opponent,
                settings: req.body.settings || {},
                initializerColor,
                opponentColor,
            });

            // Send a notification to the opponent
            const opponentUser = await User.findById(opponent);
            const notification = new Notification({
                type: 'gameRequest',
                message: `${session.user.username} has sent you a game request.`,
                user: opponent,
                fromUsername: session.user.username,
                data:{
                    gameId: newGame._id
                }
            });

            await notification.save();
            opponentUser.notifications.push(notification._id);

            await opponentUser.save();

            const game = await newGame.save();
            res.status(201).json({gameId: game._id});
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
