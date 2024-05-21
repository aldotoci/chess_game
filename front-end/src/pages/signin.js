import { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useCookies } from 'react-cookie';
import { ThemeProvider } from '@mui/material/styles';
import MUITheme from "@/components/settings/MUITheme";
import Navbar from '@/components/Navbar/Navbar';
import { signIn } from 'next-auth/react';
import styles from '@/styles/Login.module.css';


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [, setCookie] = useCookies(['userToken']);

    async function handleLogin(email, password) {
        const res = await signIn('Credentials', {
            email,
            password,
        });
        alert('Logged in successfully!')
        return res
    }
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleLogin(email, password );
        } catch (error) {
            alert(error.response.data);
        }
    };



    return (
        <ThemeProvider theme={MUITheme}>
        <Navbar />

        <Container maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" 
                // onSubmit={handleSubmit} 
                method="post" action="/api/auth/callback/credentials"
                noValidate sx={{ mt: 1 }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
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
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                </Box>
            </Box>
        </Container>
      </ThemeProvider>  

    );
}

export default Login;
