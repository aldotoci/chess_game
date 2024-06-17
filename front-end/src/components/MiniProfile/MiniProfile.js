import React from 'react';

import styles from './MiniProfile.module.css';

const MiniProfile = ({ user }) => {
    console.log(user);
    return (
        <div className={styles.miniProfile}>
            <img src={"/images/default_profile_pic.svg"} alt="Profile" className={styles.profileImage} />
            <h3 className={styles.username}>{user.username}</h3>
            <p className={styles.rating}>Rating: {user.currentRating}</p>
        </div>
    );
};

export default MiniProfile;