import User from '../../models/User';
import connectDB from '@/lib/mongodb';
import { getServerSession  } from 'next-auth/next';
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import Notification from '@/models/Notifications';

export default async function handler(req, res) {
    await connectDB();
    
    if (req.method === 'POST') {
        const session = await getServerSession(req, res, authOptions);

        if (!session) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const userId = session.user._id.toString();
        try {
            // Find the users in the database
            const user = await User.findById(userId).populate('notifications');
            const friend = await User.findById(req.body.friendId).populate('notifications');

            const friendId = friend._id.toString()

            // Make some validations here
            if (!user || !friend) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            // Check if the user is already friends with the recipient
            if (user.friends.includes(friendId)) {
                return res.status(400).json({ message: 'You are already friends with this user' });
            }

            // Check if the friend is on the user's addFriendRequests list
            if (!user.addFriendRequests.includes(friendId)) {
                return res.status(400).json({ message: 'You have not received a friend request from this user' });
            }

            // Add friendId to the user's friend list
            user.friends.push(friendId);
            await user.save();

            // Add userId to the friend's friend list
            friend.friends.push(userId);
            await friend.save();

            const promises = [];

            // Remove notification from user's notifications
            user.notifications = user.notifications.filter(
                (notification) => {
                    const toDelete = notification.fromUsername === friend.username

                    if(toDelete) {
                        promises.push(Notification.findByIdAndDelete(notification._id.toString()));
                    }

                    return !toDelete
                }
            );


            // Remove notification from friend's notifications
            friend.notifications = friend.notifications.filter(
                (notification) => {
                    const toDelete = notification.fromUsername === user.username

                    if(toDelete) {
                        promises.push(Notification.findByIdAndDelete(notification._id.toString()));
                    }

                    return !toDelete
                }
            );

            // Remove friendId from user's sendFriendRequests
            user.sendFriendRequests = user.sendFriendRequests.filter(
                (request) => request.toString() !== friendId
            );
            user.addFriendRequests = user.addFriendRequests.filter(
                (request) => request.toString() !== friendId
            );


            // Remove userId from friend's friendRequests
            friend.sendFriendRequests = friend.sendFriendRequests.filter(
                (request) => request.toString() !== userId
            );
            friend.addFriendRequests = friend.addFriendRequests.filter(
                (request) => request.toString() !== userId
            );

            promises.push(user.save())
            promises.push(friend.save())
            await Promise.all(promises);

            res.status(200).json({ message: 'Friend added successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    else if (req.method === 'DELETE') {
        const session = await getServerSession(req, res, authOptions);
        
        if (!session) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const userId = session.user._id.toString();
        
        try {
            const { friendId } = req.body;

            console.log('friendId', friendId)

            // Find the users in the database
            const user = await User.findById(userId).populate('notifications');
            const friend = await User.findById(friendId).populate('notifications');

            console.log('user', user)
            console.log('friend', friend)

            // Make some validations here
            if (!user || !friend) {
                return res.status(404).json({ message: 'User not found' });
            }

            console.log('user.friends', user.friends, 'friendId', friendId)

            // Check if the user is already friends with the recipient
            if (!user.friends.map(e => e.toString()).includes(friendId)) {
                return res.status(400).json({ message: 'You are not friends with this user' });
            }

            // Remove friendId from user's addFriendRequests and friend's sendFriendRequests
            user.addFriendRequests = user.addFriendRequests.filter(
                (request) => request.toString() !== friendId
            );
            user.sendFriendRequests = user.sendFriendRequests.filter(
                (request) => request.toString() !== friendId
            );

            friend.addFriendRequests = friend.addFriendRequests.filter(
                (request) => request.toString() !== userId
            );

            friend.sendFriendRequests = friend.sendFriendRequests.filter(
                (request) => request.toString() !== userId
            );

            const promises = [];

            // Remove notification from user's notifications
            user.notifications = user.notifications.filter(
                (notification) => {
                    const toDelete = notification.fromUsername === friend.username

                    if(toDelete) {
                        promises.push(Notification.findByIdAndDelete(notification._id.toString()));
                    }

                    return !toDelete
                }
            );

            // Remove notification from friend's notifications
            friend.notifications = friend.notifications.filter(
                (notification) => {
                    const toDelete = notification.fromUsername === user.username

                    if(toDelete) {
                        promises.push(Notification.findByIdAndDelete(notification._id.toString()));
                    }

                    return !toDelete
                }
            );

            // Remove friendId from user's friends
            user.friends = user.friends.filter((friend) => friend.toString() !== friendId);

            // Remove userId from friend's friends
            friend.friends = friend.friends.filter((friend) => friend.toString() !== userId);

            promises.push(user.save());
            promises.push(friend.save());

            await Promise.all(promises);
            res.status(200).json({ message: 'Friend removed successfully' });
        }catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    else if (req.method === 'GET') {
        const session = await getServerSession(req, res, authOptions);
        
        if (!session) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const userId = session.user._id.toString();
        
        try {
            const user = await User.findById(userId).populate('friends');

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.friends.forEach((friend) => {
                friend.password = undefined;
            })

            res.status(200).json(user.friends);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}