import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { useLoaderData } from 'react-router-dom';

const Selector = ({ id, label, data, ...otherProps }) => {
  const labelId = `${id}-label`;

  return (
    <FormControl fullWidth minWidth="100%">
      <InputLabel id={labelId}>{label} </InputLabel>
      <Select labelId={labelId} id={id} label={label} {...otherProps}>
        <MenuItem value="">Select</MenuItem>
        {data?.map(({ value, label }) => (
          <MenuItem value={value} key={value}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export const SearchForm = ({ onSearch, onClear }) => {
  const { nations, categories, years } = useLoaderData();

  const [formData, setFormData] = useState({
    nation: '',
    year: '',
    category: '',
  });

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = () => {
    onSearch?.(formData);
  };

  const handleClear = () => {
    setFormData({
      nation: '',
      year: '',
      category: '',
    });
    onClear?.();
  };

  return (
    <>
      <Typography variant="h2" fontSize={40} mb="20px">
        Search
      </Typography>

      <Stack spacing={2}>
        <Selector
          name="nation"
          data={nations}
          id="nation-list"
          label="Nation"
          value={formData.nation}
          onChange={handleChange}
        />
        <Selector
          name="year"
          data={years}
          id="year-list"
          label="Year"
          value={formData.year}
          onChange={handleChange}
        />
        <Selector
          name="category"
          data={categories}
          id="category-list"
          label="Category"
          value={formData.category}
          onChange={handleChange}
        />

        <Box pt="12px" gap="10px" display="flex">
          <Button
            fullWidth
            variant="outlined"
            color="success"
            onClick={handleSubmit}
          >
            Search
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={handleClear}
          >
            Clear
          </Button>
        </Box>
      </Stack>
    </>
  );
};
