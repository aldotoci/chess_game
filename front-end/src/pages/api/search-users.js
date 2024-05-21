import User from '@/models/User';
import { getServerSession  } from 'next-auth/next';
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import connectDB from '@/lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        await connectDB();
        const session = await getServerSession(req, res, authOptions);
        const {username} = req.query;

        // Perform the search logic here
        const foundUsers = await User.find({ username: { $regex: username, $options: 'i' } });    // Case-insensitive search

        // Prepare the response data
        const response = foundUsers.map(user => ({
            _id: user._id,
            username: user.username,
            currentRating: user.currentRating,
            wins: user.wins,
            losses: user.losses,
            bio: user.bio,
        })).filter(user => user.username !== session.user.username);    // Exclude the current user from the search results

        res.status(200).json(response);
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}