// components/CountrySelect.js
import { useState } from 'react';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { countries } from 'countries-list'; // Import the list of countries

function CountrySelect({ value, onChange }) {
  const [selectedCountry, setSelectedCountry] = useState(value);

  const handleChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    onChange(e);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="country-select-label">Country</InputLabel>
      <Select
        labelId="country-select-label"
        id="country-select"
        value={selectedCountry}
        onChange={handleChange}
      >
        {Object.keys(countries).map((code) => (
          <MenuItem key={code} value={countries[code].name}>
            {countries[code].name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default CountrySelect;
