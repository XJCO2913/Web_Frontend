import { useScroll } from 'framer-motion';

import Box from '@mui/material/Box';

import ScrollProgress from 'src/components/scroll-progress';

import Hero from '../hero';
import HeroInfo from '../hero-info';
import HeroPricing from '../hero-pricing';
import HeroFooter from '../hero-footer';
import HeroUI from '../hero-UI';

// ----------------------------------------------------------------------

export default function HeroView() {
  const { scrollYProgress } = useScroll();

  return (
    <>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      <Hero />

      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.default',
        }}
      >
        <HeroInfo />

        <HeroUI />

        <HeroPricing />

        <HeroFooter />
      </Box>
    </>
  );
}
