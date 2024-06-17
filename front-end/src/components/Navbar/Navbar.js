import React, { useState } from "react";
import Link from "next/link";
import NewGameButton from "../buttons/newGameButton";
import { useSession } from "next-auth/react";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import SearchBar from "../searchbar/SearchBar";
import Notifications from "../Notifications/Notifications";

import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  Box,
  ListItemButton,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import theme from "@/components/settings/MUITheme";

import styles from "./Navbar.module.css"; // Import CSS module for styling

const Navbar = ({ loading }) => {
  const { data: session, status } = useSession();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (status === "loading") return null;

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const menuList = (
    <>
      {!session && (
        <>
          <ListItemButton>
            <Link href="/api/auth/signin">Login</Link>
          </ListItemButton>
          <ListItemButton>
            <Link href="/register">Register</Link>
          </ListItemButton>
        </>
      )}
      {session && (
        <>
          <>
            <ListItemButton>
              <NewGameButton />
            </ListItemButton>
            <ListItemButton>
              <Link href="/profile">Profile</Link>
            </ListItemButton>
            <ListItemButton>
              <Link href="/api/auth/signout">Sign out</Link>
            </ListItemButton>
          </>
        </>
      )}
    </>
  );

  return (
    <>
      {loading && (
        <Stack
          sx={{ position: "fix", width: "100vw", color: "grey.500" }}
          spacing={2}
          direction="column"
        >
          <LinearProgress color="success" />
        </Stack>
      )}
      <div style={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar className={styles.navbar}>
            <div className={styles.logo}>
              <Link href="/">ChessOn</Link>
            </div>
            <SearchBar />
            {!isMobile && <List className={styles.navLinks}>{menuList}</List>}
            <IconButton
              edge="start"
              className={styles.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              display={{
                xs: "block",
                // sm: "none",
              }}
              style={{ marginLeft: "5px" }}
            >
              <MenuIcon />
            </IconButton>
            <Notifications />
          </Toolbar>
        </AppBar>
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
          <div
            className={styles.drawerList}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            {session && (
              <>
                {isMobile && menuList}
                <ListItemButton>
                  <Link href="/friends">Friends</Link>
                </ListItemButton>
              </>
            )}
          </div>
        </Drawer>
      </div>
    </>
  );
};

export default Navbar;
