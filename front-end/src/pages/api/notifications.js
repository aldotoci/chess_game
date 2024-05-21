import User from "@/models/User";
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { getServerSession  } from 'next-auth/next';
import connectDB from '@/lib/mongodb';
import Notifications from "@/models/Notifications"; // Import the Notification model

export default async function handler(req, res) {
    if (req.method === 'GET') {
        await connectDB();

        try{
            const session = await getServerSession(req, res, authOptions);
            const userId = session.user._id;


            if (!session) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const user = await User.findOne({ _id: userId }).populate('notifications');
            const notifications = user.notifications;

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json({ notifications });
        }catch(error){
            return res.status(500).json({ message: 'Internal server error' });
        }   
    }
}

