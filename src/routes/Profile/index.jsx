import {
  Box,
  Container,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import { Button } from '@mui/material';
import { useLoaderData, useNavigate } from 'react-router-dom';

export const Profile = () => {
  const navigate = useNavigate();
  const profile = useLoaderData();

  const onBackButtonClickHandler = () => {
    navigate('/');
  };

  return (
    <Container>
      <Button
        sx={{ position: 'absolute', left: '20px', top: '15px' }}
        type="button"
        onClick={onBackButtonClickHandler}
      >
        <ArrowBackIosRoundedIcon sx={{ mr: 1 }} /> Back
      </Button>
      <Typography variant="h1" fontSize={60} align="center" mt="40px" mb="50px">
        Nobel Prize Winners
      </Typography>
      <Container>
        <Box mb={1} mt={2}>
          <Typography variant="h3" display="inline" pr={2}>
            {profile.name}
          </Typography>
        </Box>

        <Typography
          variant="h5"
          mb={4}
          display="block"
          color="#1976d2"
          {...(profile.prize && {
            component: Link,
            href: profile.prize,
            underline: 'hover',
            target: '_blank',
            rel: 'noopener',
          })}
        >
          Nobel Prize for {profile.prizeType}, {profile.year}
        </Typography>

        <Grid container mx={4}>
          <Grid xs={12} sm={9} md={6} lg={8}>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell variant="head" sx={{ fontWeight: '700' }}>
                    Nation
                  </TableCell>
                  <TableCell>{profile.nation}</TableCell>
                </TableRow>
                {profile.birthYear && (
                  <TableRow>
                    <TableCell variant="head" sx={{ fontWeight: '700' }}>
                      Birth Year
                    </TableCell>
                    <TableCell>{profile.birthYear}</TableCell>
                  </TableRow>
                )}
                {profile.deathYear && (
                  <TableRow>
                    <TableCell variant="head" sx={{ fontWeight: '700' }}>
                      Death Year
                    </TableCell>
                    <TableCell>{profile.deathYear}</TableCell>
                  </TableRow>
                )}
                {profile.motivation && (
                  <TableRow>
                    <TableCell variant="head" sx={{ fontWeight: '700' }}>
                      Motivation
                    </TableCell>
                    <TableCell>{profile.motivation}</TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell variant="head" sx={{ fontWeight: '700' }}>
                    Nobel Prize Category
                  </TableCell>
                  <TableCell>{profile.prizeType}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head" sx={{ fontWeight: '700' }}>
                    Nobel Prize Year
                  </TableCell>
                  <TableCell>{profile.year}</TableCell>
                </TableRow>
                {profile.association && (
                  <TableRow>
                    <TableCell variant="head" sx={{ fontWeight: '700' }}>
                      Association
                    </TableCell>
                    <TableCell>{profile.association}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
};
