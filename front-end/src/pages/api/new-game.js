// pages/api/new-game.js
import dbConnect from '../../lib/mongodb';
import Game from '../../models/Game';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        await dbConnect();

        try {
            const gameId = Math.random().toString(36).substring(2, 15);
            const newGame = new Game({
                gameId: gameId,
                initializer: req.body.initializer,
                opponent: req.body.opponent,
                settings: req.body.settings || {}
            });

            const game = await newGame.save();
            res.status(201).json(game);
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
