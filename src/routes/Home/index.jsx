import { Container, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

import { SearchForm } from './SearchForm';
import { useCallback, useState } from 'react';
import { Results } from './Results';

const getSearchApi = ({ nation, year, category }) => {
  let api = '/nobel';

  if (year) {
    api += `/year/${year}`;
  }

  if (category) {
    api += `/category/${category}`;
  }
  
  if (nation) {
    api += `/nation/${nation}`;
  }

  return api;
};

const parseResponse = (responseData) =>
  responseData.map(({ winnerName, year, prizeType, nation }, index) => ({
    id: index,
    name: winnerName?.value || null,
    year: year?.value || null,
    category: prizeType?.value?.split('#')?.pop().replace('Prize', '') || null,
    nation: nation?.value?.split('/')?.pop().replace(/_/g, ' ') || null,
  }));

export const Home = () => {
  const [winners, setWinners] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async (formData) => {
    // TODO: Add backdrop.
    try {
      if (!formData.nation && !formData.year && !formData.category) {
        setSearched(false);
        return;
      }

      const api = getSearchApi(formData);

      const responseData = await fetch(api);
      const data = await responseData.json();

      const newWinners = parseResponse(data?.results?.bindings ?? []);

      setWinners(newWinners);
      setSearched(true);
    } catch (error) {
      setWinners([]);
      setSearched(true);
    }
  }, []);

  const handleClear = () => {
    setWinners([]);
    setSearched(false);
  };

  return (
    <Container>
      <Typography variant="h1" fontSize={60} align="center" mt="30px" mb="50px">
        Nobel Prize Winners
      </Typography>

      <Grid container spacing={5}>
        <Grid sm={4} md={3} xs={12}>
          <SearchForm onSearch={handleSearch} onClear={handleClear} />
        </Grid>
        <Grid sm={8} md={9} xs={12} position="relative" minHeight="200px">
          {searched ? (
            <Results data={winners} />
          ) : (
            <Typography
              left="50%"
              width="80%"
              textAlign="center"
              sx={{ transform: 'translate(-50%, -50%)' }}
              position="absolute"
              top="50%"
              variant="h2"
              fontSize={40}
            >
              Start search to view winners
            </Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};
