// components/Register.js
import { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import CountrySelect from "@/components/CountrySelect";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import HomeWrapper from '@/components/HomeWrapper/HomeWrapper';

import styles from '@/styles/Register.module.css';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [country, setCountry] = useState('');
    const [bio, setBio] = useState('');
    const [message, setMessage] = useState(); // Add this line
    const [error, setError] = useState(); // Add this line
    const [loading, setLoading] = useState(false); // Add this line

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !email || !password || !country || !bio) {
            setSuccess(null);
            setError('Please fill in all fields');
            return;
        }
        try {
            setLoading(true);
            await axios.post('/api/auth/register', { username, email, password, country, bio }).then(res => {
                if (res && res.data){
                    setError(null);
                    setMessage(res.data.message);
                    setTimeout(() => {
                        setMessage(null);
                        router.push('/api/auth/signin'); // Redirect to login page after successful registration
                    }, 1000);
                }
                setLoading(false)
               }
            )
            .catch(err => {
                setLoading(false);
                setMessage(null);
                if (err && err.response) setError(err.response.data.message);
                setTimeout(() => {
                    setError(null);
                }, 2000);
            })
        } catch (error) {
            alert(error.response.data);
        }
    };

    return (
        <HomeWrapper>
            <Container maxWidth="xs">
                {(message || error) && (
                    <Stack sx={{ position: 'absolute', top: '10vh', left: '50%', transform: 'translateX(-50%)' }} spacing={2} direction="column">
                        <Alert severity={message ? "success" : "error"}>
                            {message || error}
                        </Alert>
                    </Stack>
                )}
                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h5">
                        Register
                    </Typography>
                    <Box component="form" className={styles.formContainer} onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="bio"
                            label="Bio"
                            type="text"
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                        <CountrySelect
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            className={styles.submitButton}
                        >
                            Register
                        </Button>
                    </Box>
                </Box>
            </Container>
        </HomeWrapper>
    );
}

export default Register;