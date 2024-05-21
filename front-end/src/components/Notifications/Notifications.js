import React, { useState, useEffect } from 'react';
// import { Badge, Popover, List, ListItem, ListItemText } from '@material-ui/core';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import { ListItemButton } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import { useRouter } from 'next/router';

const Notifications = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const router = useRouter();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'notifications-popover' : undefined;


    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('/api/notifications');
                const data = await response.json();
                // Process the data and update the state
                setNotifications(data?.notifications || []);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    const linksForNotifications = {
        friendRequest: '/profile?username=',
    };

    const handleNotificationClick = (notification) => {
        // Handle notification click logic here
        console.log('Notification clicked:', notification);

        // Redirect to the appropriate page
        router.push(linksForNotifications[notification.type] + notification.fromUsername);
    };

    return (
        <>
            <IconButton color="inherit" onClick={handleClick}>
                <Badge badgeContent={notifications.length} color="secondary">
                    <CircleNotificationsIcon />
                </Badge>
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <List>
                    {notifications.length === 0 && <ListItemButton> No notifications </ListItemButton>}
                    {notifications.map((notification) => (
                        <ListItemButton key={notification._id} onClick={() => handleNotificationClick(notification)}>
                            <ListItemText primary={notification.message} />
                        </ListItemButton>
                    ))}
                </List>
            </Popover>
        </>
    );
};

export default Notifications;