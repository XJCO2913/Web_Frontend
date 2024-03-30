import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import CardContent from '@mui/material/CardContent';

import Map from './draft'
// ----------------------------------------------------------------------

// const THEMES = {
//   streets: 'mapbox://styles/mapbox/streets-v11',
//   outdoors: 'mapbox://styles/mapbox/outdoors-v11',
//   light: 'mapbox://styles/mapbox/light-v10',
//   dark: 'mapbox://styles/mapbox/dark-v10',
//   satellite: 'mapbox://styles/mapbox/satellite-v9',
//   satelliteStreets: 'mapbox://styles/mapbox/satellite-streets-v11',
// };

// const baseSettings = {
//   mapboxAccessToken: GAODE_API.apiKey,
//   minZoom: 1,
// };

const StyledMapContainer = styled('div')(({ theme }) => ({
  zIndex: 0,
  height: 600,
  overflow: 'hidden',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  '& .mapboxgl-ctrl-logo, .mapboxgl-ctrl-bottom-right': {
    display: 'none',
  },
}));

// ----------------------------------------------------------------------

export default function MapView() {
  return (
    <>
      <Container sx={{ height:"100%" }}>
        <Stack spacing={5}>
          <Card>
            <CardContent>
              <StyledMapContainer>
                <Map />
              </StyledMapContainer>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </>
  );
}
