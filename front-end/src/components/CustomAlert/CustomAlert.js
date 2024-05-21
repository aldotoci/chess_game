
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

export default function CustomAlert({ message, severity="error" }) {
    
    if (!message) return null;
    
    return (
        <Stack sx={{ position: 'absolute', top: '10vh', left: '50%', transform: 'translateX(-50%)' }} spacing={2} direction="column">
            <Alert severity={severity}>
                {message}
            </Alert>
        </Stack>
    );
}