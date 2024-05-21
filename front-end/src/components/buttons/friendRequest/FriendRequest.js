import React, { use } from 'react';
import Button from '@mui/material/Button';
import { useSession } from "next-auth/react";

import styles from './FriendRequest.module.css';

const FriendRequest = ({usernameData}) => {
    const { data: session, status, update } = useSession();

    const user = session?.user;

    const userAlreadySendRequest = user.sendFriendRequests.includes(usernameData._id);

    const userAlreadyReceivedRequest = user.addFriendRequests.includes(usernameData._id);

    const doesUserAlreadyHaveFriend = user.friends.includes(usernameData._id);

    const handleFriendRequest = async () => {
        // Handle friend request logic here

        // Send a friend request to the user
        const response = await fetch('/api/friend-request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // Add the necessary data here
                userId: usernameData._id,
            }),
        });
        update();
    };

    const handleRemoveFriendRequest = async () => {
        // Handle remove friend request logic here

        // Remove the friend request
        const response = await fetch('/api/friend-request', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // Add the necessary data here
                userId: usernameData._id,
            }),
        });
        update();
    }

    const handleAcceptFriendRequest = async () => {
        // Handle accept friend request logic here

        // Accept the friend request
        await fetch('/api/friend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // Add the necessary data here
                friendId: usernameData._id,
            }),
        });
        update();
    }

    const handleRemoveFriend = async () => {
        // Handle remove friend logic here

        // Remove the friend
        await fetch('/api/friend', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // Add the necessary data here
                friendId: usernameData._id,
            }),
        });
        update();
    }


    if (userAlreadySendRequest)
        return (
            <Button variant="outlined" color="error" onClick={handleRemoveFriendRequest}>
                Remove Friend Request
            </Button>
        );
    else if (userAlreadyReceivedRequest)
        return (
            <Button variant="outlined" color="primary" onClick={handleAcceptFriendRequest}>
                Accept Friend Request
            </Button>
        );
    else if (doesUserAlreadyHaveFriend)
        return (
            <Button variant="outlined" color="error" onClick={handleRemoveFriend}>
                Remove Friend
            </Button>
        );
    else
        return (
            <Button variant="outlined" color="success" onClick={handleFriendRequest}>
                Send Friend Request
            </Button>
        );

};

export default FriendRequest;