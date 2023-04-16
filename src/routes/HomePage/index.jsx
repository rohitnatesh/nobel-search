import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';

export const HomePage = () => {
  const [nations, categories, years] = useLoaderData();

  console.log({ nations });

  //   const [selectednation]

  return (
    <Box>
      <Typography variant="h1" fontSize={60} align="center">
        Nobel Prize Winners
      </Typography>

      <Box mt="40px">
        <FormControl sx={{ width: '30%', ml: '20px' }}>
          <InputLabel id="nations-list-label">Nation</InputLabel>
          <Select
            labelId="nations-list-label"
            id="nations-list"
            // value={age}
            label="Nation"
            // onChange={handleChange}
          >
            {nations?.map((nation) => (
              <MenuItem value={nation} key={nation}>
                {nation}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ width: '30%', ml: '20px' }}>
          <InputLabel id="years-list-label">Year</InputLabel>
          <Select
            labelId="years-list-label"
            id="years-list"
            // value={age}
            label="Year"
            // onChange={handleChange}
          >
            {years?.map((year) => (
              <MenuItem value={year} key={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ width: '30%', ml: '20px' }}>
          <InputLabel id="categories-list-label">Category</InputLabel>
          <Select
            labelId="categories-list-label"
            id="categories-list"
            // value={age}
            label="Category"
            // onChange={handleChange}
          >
            {categories?.map((category) => (
              <MenuItem value={category} key={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};
