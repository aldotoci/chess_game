// pages/api/new-game.js
import dbConnect from '../../lib/mongodb';
import Game from '../../models/Game';
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
            const initializerColor = randomColor === 0 ? 'white' : 'black';
            const opponentColor = initializerColor === 'white' ? 'black' : 'white';
            
            const newGame = new Game({
                initializer,
                opponent,
                settings: req.body.settings || {},
                initializerColor,
                opponentColor,
            });

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
