import React, { useState } from 'react';
import { TextField, Autocomplete } from '@mui/material';
import { useRouter } from 'next/router';

import Styles from './SearchBar.module.css';

const SearchBar = () => {
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const router = useRouter();

    const handleSearchChange = (event, value) => {
        setSearchValue(value);
        if (value.length < 3) {
            setSearchResults([]);
            return;
        }
        fetch(`/api/search-users?username=${value}`).then(response => response.json()).then(data => {
            console.log('data', data);
            setSearchResults(data);
        });
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        router.push('/api/auth/signin'); // Redirect to login page after successful registration
    };

    const renderOption = (props, o) => {
        console.log('props', props)
        return <div 
            className={Styles.renderOption} 
            {...props}
            onClick={(e) => {
                router.push(`/profile?username=${o.username}`)
                props.onClick(e)
            }}
            >
            {o.username} | Rating: {o.currentRating} | Wins: {o.wins} | Losses: {o.losses} 
        </div>
    }

    return (
        <form style={{width: 'calc(50%)'}} onSubmit={handleSearchSubmit}>
            <Autocomplete
                freeSolo
                options={searchResults}
                getOptionLabel={(option) => option.username}
                renderOption={renderOption}
                inputValue={searchValue}
                onInputChange={handleSearchChange}
                
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search for players"
                        variant="outlined"
                        fullWidth
                        autoFocus
                        size="small"
                    />
                )}
            />
        </form>
    );
};

export default SearchBar;

