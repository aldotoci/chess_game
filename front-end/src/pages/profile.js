import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CountrySelect from "@/components/CountrySelect";
import Classes from "@/styles/Profile.module.css";
import ProfileInfo from "@/components/ProfileInfo/ProfileInfo";
import FriendRequest from "@/components/buttons/friendRequest/FriendRequest";
import HomeWrapper from '@/components/HomeWrapper/HomeWrapper';
import GameRequest from "@/components/buttons/GameRequest/GameRequest";


export default function Profile() {
  const { data: session, status, update } = useSession();
  const [editing, setEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [usernameQData , setUsernameQData] = useState(null);
  const router = useRouter();
  
  const user = session?.user;
  console.log("user", user);

  const { username: usernameQ } = router.query;

  useEffect(() => {
    if (usernameQ) {
      fetch(`/api/search-users?username=${usernameQ}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("data", data?.[0]);
          setUsernameQData(data?.[0] ? ({...data?.[0]}) : NaN);
        });
    }else{
      setUsernameQData(null);
    }
  }, [usernameQ]);

  if (status === "loading") return null;
  if (status === "unauthenticated") return router.push("/api/auth/signin");
  
  const onEditClick = () => {
    setEditing(true);
    setUpdatedUser({
      username: user.username,
      email: user.email,
      country: user.country,
      bio: user.bio,
    });
  };

  const handleChange = (e, name) => {
    const { value } = e.target;
    setUpdatedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/update-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    })
		if (response.ok) {
			const {user} = await response.json();
			// Update the user's session and token with the new information
			await update();

			setEditing(false);
    
		}
  };


  const editProfileForm = (
    <form className={Classes.form} onSubmit={handleSubmit}>
      <TextField
        required
        id="outlined-required"
        label="Username"
        defaultValue={updatedUser.username}
        onChange={(e) => handleChange(e, "username")}
      />
      <TextField
        required
        id="outlined-required"
        label="Email"
        defaultValue={updatedUser.email}
        onChange={(e) => handleChange(e, "email")}
      />
      <CountrySelect
        value={updatedUser.country}
        onChange={(e) => handleChange(e, "country")}
      />
      <TextField
        id="outlined-multiline-static"
        label="Bio"
        multiline
        rows={4}
        defaultValue={updatedUser.bio}
        onChange={(e) => handleChange(e, "bio")}
      />
      <div className={Classes.buttonContainer}>
        <Button variant="contained"  color="success" type="submit">Save</Button>
        <Button variant="contained"  color="error" onClick={() => setEditing(false)}>Cancel</Button>
      </div>
    </form>
  )

  const loggedInUser = editing ? (
    editProfileForm
  ) : (
    <>
      <ProfileInfo user={user} />
      <Button onClick={onEditClick}>Edit</Button>
    </>
  );

  return (
      <HomeWrapper>
        <div className={Classes.container}>
          <div className={Classes.wrapper}>
            <h2 className={Classes.userProfile}>User Profile</h2>
            {
              usernameQ ? 
                (!!!usernameQData ? "Not Found" : <ProfileInfo user={usernameQData} />) 
              : loggedInUser}
          </div>
          <div className={Classes.wrapper}>
            {usernameQData && <FriendRequest usernameData={usernameQData} />}
            {usernameQData && <GameRequest usernameData={usernameQData} />}
            <h2 className={Classes.userProfile}>
                Game History
              {/* {TO DO} */}
            </h2>
          </div>
        </div>
    </HomeWrapper>
  );
}
