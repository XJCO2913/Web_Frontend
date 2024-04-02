import PropTypes from 'prop-types';
import { useSwipeable } from 'react-swipeable';
import { m, AnimatePresence } from 'framer-motion';
import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

const ControlBar = ({ onEnd, onPause, isPaused, expanded, setIsExpanded }) => {

    const swipeHandlers = useSwipeable({
        onSwipedDown: () => setIsExpanded(false),
        onSwipedUp: () => setIsExpanded(true),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
    });

    const theme = useTheme();
    const controlBarVariants = {
        expanded: {
            height: "93vh",
            backgroundColor: "#45404b",
            width: "100%",
            overflow: 'hidden',
            borderRadius: theme.shape.borderRadius,
        },
        collapsed: {
            height: "13.7vh",
            backgroundColor: "#45404b",
            width: "100%",
            overflow: 'hidden',
            borderRadius: theme.shape.borderRadius,
            pb: 13,
        }
    };

    return (
        <AnimatePresence>
            <m.div
                {...swipeHandlers}
                animate={expanded ? "expanded" : "collapsed"}
                variants={controlBarVariants}
                style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 100 }}
            >
                <div
                    style={{
                        transform: 'translate(310%, 50%)',
                        width: '50px',
                        height: '6px',
                        backgroundColor: 'grey',
                        borderRadius: '5px',
                        border: "1px solid grey",
                        color: 'black',
                        zIndex: 1000,
                        mb: 100
                    }}
                >
                </div>
                {expanded ? (
                    <div>
                        {/* Expanded state content */}
                        <Button variant="contained" onClick={onPause} color={isPaused ? "secondary" : "primary"}>
                            {isPaused ? 'Resume' : 'Pause'}
                        </Button>
                        <Button variant="contained" color="error" onClick={onEnd}>
                            End
                        </Button>
                        {/* Add more components or content you want to show when expanded */}
                    </div>
                ) : (
                    <Grid container
                        sx={{
                            mt: 1,
                            ml: 1.9,
                        }}
                        spacing={1}
                    >
                        <Grid item
                            sx={{
                                color: "white"
                            }}
                            xs={4}
                        >
                            <Typography
                                sx={{
                                    fontSize: 35,
                                    fontWeight: 600
                                }}>
                                {0.00.toFixed(2)}
                            </Typography>

                            <Typography
                                sx={{
                                   
                                    fontSize: 13,
                                    fontWeight: 500,
                                    color:"#807b88"
                                }}>
                                Total Distance
                            </Typography>

                        </Grid>
                        <Grid item
                            sx={{
                                color: "white"
                            }}
                            xs={4}
                        >
                            <Typography
                                sx={{
                                    fontSize: 35,
                                    fontWeight: 600
                                }}>
                                {"00:00"}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 13,
                                    fontWeight: 500,
                                    color:"#807b88"
                                }}>
                                Total Time
                            </Typography>
                        </Grid>
                        <Grid item
                            sx={{
                                color: "white"
                            }}
                            xs={4}
                        >
                            <Typography
                                sx={{
                                    fontSize: 35,
                                    fontWeight: 600
                                }}>
                                {0.00.toFixed(2)}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 13,
                                    fontWeight: 500,
                                    color:"#807b88"
                                }}>
                                Speed
                            </Typography>
                        </Grid>
                    </Grid>
                )}
            </m.div>
        </AnimatePresence>
    );
};

ControlBar.propTypes = {
    onEnd: PropTypes.func.isRequired,
    onPause: PropTypes.func.isRequired,
    isPaused: PropTypes.bool.isRequired,
    expanded: PropTypes.bool.isRequired,
    setIsExpanded: PropTypes.func.isRequired,
};

export default ControlBar;