// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Username or Email", type: "text", placeholder: "jsmith or jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;
        await connectDB();

        // Determine if the input is an email or username
        const isEmail = email.includes('@');

        // Find user by email or username
        const user = await User.findOne(isEmail ? { email: email } : { username: email }).exec();
        if (!user) {
          // throw new Error('No user found with the provided username or email');
          return null
        }

        // Check password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          // throw new Error('Password is incorrect');
          return null;
        }

        // Return user object if valid
        return user;
      }
    })
  ],
  session: {
    jwt: true, 
  },
  // pages: {
  //   signIn: '/signin',
  //   signOut: '/signout',
    // error: '/auth/error',
  // },
  callbacks: {
    jwt: async ({ token, user }) => {
      await connectDB();
      if (user) 
        token.user = await User.findById(user._id);
      
      return token;
    },
    session: async ({ session, token }) => {
      session.user = await User.findById(token.user._id) ;
      return session;
    },
    // async signIn({ account, profile}) {
    //   if(!profile){
    //     throw new Error("No profile");
    //   }
    //   let user_db = await Booking_user.findOne({email: profile.email})
    //   if(!user_db){
    //     user_db = await Booking_user.create({
    //       email: profile.email,
    //       name: profile.name,
    //       unix_timestamp: Date.now(),
    //     });
    //   }
    //   if(user_db?.name !== profile.name){
    //     user_db.name = profile.name;
    //     await user_db.save();
    //   }
    //   return true;
    // }
  },
}

export default NextAuth(authOptions);
