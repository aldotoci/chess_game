

export default function ProfileInfo({user}) {

    return <>
        {user.profilePicture && (
        // <img src={user.profilePicture} alt="Profile" style={{ width: 100, height: 100, borderRadius: '50%' }} />
        <img
            src={"/images/default_profile_pic.svg"}
            alt="Profile"
            style={{ width: 100, height: 100, borderRadius: "50%" }}
        />
        )}
        <p>Username: {user.username}</p>
        {user?.email && <p>Email: {user.email}</p>}
        <p>Raing: {user?.currentRating}</p>
        <p>Country: {user.country || "Unknown"}</p>
        <p>Bio: {user.bio || "No bio provided"}</p>
        <p>
            Preferred Opening: {user.preferredOpening || "Not specified"}
        </p>
        <p>Wins: {user.wins}</p>
        <p>Losses: {user.losses}</p>
    </>
}