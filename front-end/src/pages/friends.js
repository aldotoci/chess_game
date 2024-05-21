import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link'
import HomeWrapper from '@/components/HomeWrapper/HomeWrapper';
import FriendRequest from '@/components/buttons/friendRequest/FriendRequest';
import styles from '@/styles/Friends.module.css';

const Friends = () => {
    const { data: session, status, update } = useSession();
    const [friends, setFriends] = useState([]);
    const user = session?.user;
    
    // Get friends list
    useEffect(() => {
        if (user) {
            fetch(`/api/friend`)
                .then((response) => response.json())
                .then((data) => {
                    console.log("data", data);
                    setFriends(data);
                });
        }
    }, [user]);


    if (status === "loading") return null;
    if (status === "unauthenticated") router.push("/api/auth/signin");

    return (
        <HomeWrapper>
            <div className={styles.container}>
                <h1>Friends</h1>
                <div className={styles.friendContainer}>
                    <div>#</div>
                    <div>Username: </div>
                    <div>Rating</div>
                    <div>   </div>    
                </div>
                {friends.map((friend) => (
                    <div className={styles.friendContainer} key={friend._id}>
                        <img
                            src={"/images/default_profile_pic.svg"}
                            alt="Profile"
                            style={{ width: 20, height: 20, borderRadius: "50%" }}
                        />
                        <Link href={`/profile?username=${friend.username}`}>
                            {friend.username}
                        </Link>
                        {user?.currentRating}
                        <FriendRequest usernameData={friend} />
                    </div>
                ))}
            </div>
        </HomeWrapper>
    );
};

export default Friends;