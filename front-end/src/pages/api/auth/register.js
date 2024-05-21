// pages/api/auth/register.js
import bcrypt from 'bcryptjs';
import User from '../../../models/User';
import dbConnect from '@/lib/mongodb';
import { countries } from 'countries-list'; // Import the list of countries


export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, email, password, country, bio } = req.body;   

        await dbConnect();

        // country is in long english format

        // Validate required fields
        if (!username || !email || !password || !country || !bio) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if the user already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(409).json({ message: 'User already exists with this username' });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists with this email' });
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email' });
        }

        // Validate password
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Validate country
        if (!Object.keys(countries).map(k => countries[k]['name']).includes(country)) {
            return res.status(400).json({ message: 'Invalid country' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        // Automatically log in the user after registration (optional)
        // You can use NextAuth's signIn function here if you want to auto-login the user


        res.status(201).json({ message: 'User registered successfully' });
    } else {
        // Handle any other HTTP methods
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
