import User from '../../models/User';
import { getServerSession  } from 'next-auth/next';
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import Notifications from '@/models/Notifications';
import connectDB from '@/lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'POST') {
		await connectDB();
		const session = await getServerSession(req, res, authOptions);

		if (!session) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		const { userId } = req.body;
		console.log('userId', req.body);

		// Add userId to the current login's friends list
		const user = await User.findOne({ email: session.user.email });
		const recUser = await User.findOne({ _id: userId });

		// Check if the user is already friends with the recipient
		if (user.friends.includes(recUser._id)) {
			return res.status(400).json({ message: 'You are already friends with this user' });
		}

		// Check if the user has already sent a friend request to the recipient
		if (user.sendFriendRequests.includes(recUser._id)) {
			return res.status(400).json({ message: 'You have already sent a friend request to this user' });
		}

		// Check if the recipient has already sent a friend request to the user
		if (recUser.addFriendRequests.includes(user._id)) {
			return res.status(400).json({ message: 'This user has already sent you a friend request' });
		}

		user.sendFriendRequests.push(recUser._id);
		recUser.addFriendRequests.push(user._id);

		// Add a notification to the user's notifications list
		const sendReq = await Notifications.create({
			 type: 'friendRequest', message: `You have sent a friend request to ${recUser.username}`, user: user._id, fromUsername: recUser.username
			});
		const sendSent = await Notifications.create({ 
			type: 'friendRequest', message: `${user.username} has sent you a friend request`, user: recUser._id, fromUsername: user.username
		});

		console.log('sendReq', sendReq);
		user.notifications.push(sendReq._id);
		recUser.notifications.push(sendSent._id);

		await user.save();
		await recUser.save();

		res.status(200).json({ message: 'User added to followersList' });
    } else if (req.method === 'DELETE') {
				await connectDB();
		const session = await getServerSession(req, res, authOptions);

		if (!session) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		const { userId } = req.body;

		// Remove userId from the current login's friends list
		const user = await User.findOne({ email: session.user.email });
		const recUser = await User.findOne({ _id: userId });

		// Check if the user is already friends with the recipient
		user.sendFriendRequests = user.sendFriendRequests.filter(id => id.toString() !== recUser._id.toString());
		recUser.addFriendRequests = recUser.addFriendRequests.filter(id => id.toString() !== user._id.toString());

		await user.save();
		await recUser.save();

		res.status(200).json({ message: 'User removed from friends list' });
	} 
	else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}