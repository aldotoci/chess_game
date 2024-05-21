// pages/api/update-profile.js
import connectDB from '@/lib/mongodb';
import User from '../../models/User';
import { getServerSession  } from 'next-auth/next';
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      await connectDB();
      const { username, email, country, bio } = req.body;
			// Validate username
			if (!username) {
				return res.status(400).json({ message: 'Username is required' });
			}

			// Validate email
			if (!email) {
				return res.status(400).json({ message: 'Email is required' });
			}

			// Validate country
			if (!country) {
				return res.status(400).json({ message: 'Country is required' });
			}

			// Validate bio
			if (!bio) {
				return res.status(400).json({ message: 'Bio is required' });
			}

			// Validate if username is available
			if (username !== session.user.username) {
				const existingUser = await User.findOne({ username });
				if (existingUser) {
					return res.status(400).json({ message: 'Username is already taken' });
				}
			}

			// Update user info
			const user = await User.findOneAndUpdate(
				{ _id: session.user._id },
				{ username, email, country, bio },
				{ new: true }
			);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
