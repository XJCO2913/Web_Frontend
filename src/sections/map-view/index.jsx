import { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';

import Iconify from 'src/components/iconify';
import { MotionContainer } from 'src/components/animate';
import { varSlide, varZoom, } from 'src/components/animate';

import Map from './map'
import ControlBar from './control-bar'

// ----------------------------------------------------------------------

const StyledMapContainer = styled('div')(({ theme }) => ({
  zIndex: 0,
  height: "77vh",
  width: "100%",
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
  '& .mapboxgl-ctrl-logo, .mapboxgl-ctrl-bottom-right': {
    display: 'none',
  },
}));

const StyledButtonContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  bottom: theme.spacing(3),
  left: '50%',
  transform: 'translate(-50%,13%)',
  zIndex: 1,
  height: "12vh",
}));

const StyledHeaderContainer = styled('div')(() => ({
  position: 'relative',
  height: "1.5vh",
}));

// ----------------------------------------------------------------------

export default function MapView() {
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isControlBarExpanded, setIsControlBarExpanded] = useState(false);

  const customVariants = varSlide({
    durationIn: 2,
    durationOut: 20,
    easeOut: "easeInOut",
  });

  // handle countdown
  useEffect(() => {
    if (isCountingDown && countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((currentCountdown) => currentCountdown - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (countdown === 0) {
      setIsCountingDown(false);
      setIsRunning(true);
    }
  }, [countdown, isCountingDown]);

  const handleGoClick = () => {
    setIsCountingDown(true);
    setIsPaused(false);
  };

  // Handlers for pause and end
  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    // Logic for pausing or resuming the run goes here
  };

  const handleEndRun = () => {
    setIsRunning(false)
    setCountdown(3) // Reset the countdown to 30 seconds
    setIsControlBarExpanded(false)
    setIsPaused(false)
  };

  const controlBarHandlers = useSwipeable({
    onSwipedDown: () => setIsControlBarExpanded(false),
    onSwipedUp: () => setIsControlBarExpanded(true),
  });

  return (
    <>
      <Container sx={{ height: "100%", width: "100%" }}>
        <Stack spacing={5}>
          <StyledHeaderContainer>
            <Box sx={{ top: 0, left: 0, mt: 2, ml: -1 }}>
              <Button
                color="inherit"
                size="small"
                rel="noopener"
                href={"/"}
                startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
              >
                Back to hero page
              </Button>
            </Box>
          </StyledHeaderContainer>

          <StyledMapContainer>
            {isRunning && !isPaused ? (
              <Map isTracking={true} />
            ) : (
              <Map isTracking={false}/>
            )}

          </StyledMapContainer>

          <StyledButtonContainer>
            {isCountingDown ? (
              <MotionContainer
                sx={{ fontSize: 70, position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', overflow: 'hidden' }}
              >
                {String(countdown).split('').map((letter, index) => (
                  <m.span key={`${countdown}-${index}`} variants={customVariants.outUp}>
                    {letter}
                  </m.span>
                ))}
              </MotionContainer>

            ) : (
              isRunning ? (
                <MotionContainer
                >
                  <m.div {...controlBarHandlers}
                    variants={varZoom().inUp}
                  >
                    <ControlBar
                      onEnd={handleEndRun}
                      onPause={handlePauseResume}
                      isPaused={isPaused}
                      expanded={isControlBarExpanded}
                      isRunning={isRunning}
                      setIsExpanded={setIsControlBarExpanded}
                    />
                  </m.div>
                </MotionContainer>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGoClick}
                  sx={{
                    borderRadius: '50%',
                    width: theme => theme.spacing(15),
                    height: theme => theme.spacing(15),
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '2rem',
                  }}
                >
                  GO
                </Button>
              )
            )}
          </StyledButtonContainer>
        </Stack>
      </Container>
    </>
  );
}