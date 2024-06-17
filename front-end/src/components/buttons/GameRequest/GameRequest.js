import {useState} from 'react';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import CustomAlert from '@/components/CustomAlert/CustomAlert';

const GameRequest = ({ usernameData }) => {
    const router = useRouter();
    const [error, setError] = useState(null);

    const handleGameRequest = async () => {
        // Send a game request to the user
        const response = await fetch('/api/game-request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // Add the necessary data here
                opponent: usernameData._id,
            }),
        });

        if (response.ok) {
            const {gameId} = await response.json();
            router.push(`/game?gameId=${gameId}`);
        }else{
            setError('Failed to send game request');
            setTimeout(() => {
                setError(null);
            }, 3000);
        }
    };
    
    return (
        <>
            <CustomAlert message={error} severity="error" />   
            <Button variant="contained" color="success" onClick={handleGameRequest}>
                Game Request
            </Button>
        </>
    );
    }

export default GameRequest;