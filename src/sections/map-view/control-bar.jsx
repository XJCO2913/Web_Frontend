import PropTypes from 'prop-types';
import { useSwipeable } from 'react-swipeable';
import { m, AnimatePresence } from 'framer-motion';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Iconify from 'src/components/iconify';

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
            height: "77vh",
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
                        <div
                            style={{
                                marginLeft: 20,
                                marginTop: 20,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 90,
                                    fontWeight: 600,
                                    color: 'white',
                                    mr: 1
                                }}>
                                {0.00.toFixed(2)}
                                <span
                                    style={{
                                        fontSize: 25,
                                        fontWeight: 600,
                                        color: "white"
                                    }}
                                >
                                    &nbsp;kms
                                </span>
                            </Typography>

                        </div>

                        <Grid container
                            sx={{
                                mt: 3,
                                ml: 2,
                            }}
                            spacing={1}
                        >

                            <Grid item
                                sx={{
                                    color: "white"
                                }}
                                xs={6}
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
                                        fontWeight: 600,
                                        color: "#807b88"
                                    }}>
                                    Total Time
                                </Typography>

                            </Grid>
                            <Grid item
                                sx={{
                                    color: "white"
                                }}
                                xs={6}
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
                                        fontWeight: 600,
                                        color: "#807b88"
                                    }}>
                                    Speed
                                </Typography>
                            </Grid>

                        </Grid>

                        <Grid container
                            sx={{
                                mt: 3,
                                ml: 2,
                            }}
                            spacing={1}
                        >

                            <Grid item
                                sx={{
                                    color: "white"
                                }}
                                xs={6}
                            >
                                <Typography
                                    sx={{
                                        fontSize: 35,
                                        fontWeight: 600
                                    }}>
                                    {0}
                                </Typography>

                                <Typography
                                    sx={{

                                        fontSize: 13,
                                        fontWeight: 500,
                                        color: "#807b88"
                                    }}>
                                    Total Consumption
                                </Typography>

                            </Grid>
                            <Grid item
                                sx={{
                                    color: "white"
                                }}
                                xs={6}
                            >
                                <Typography
                                    sx={{
                                        fontSize: 35,
                                        fontWeight: 600
                                    }}>
                                    {0}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: 13,
                                        fontWeight: 500,
                                        color: "#807b88"
                                    }}>
                                    Real-time heart rate
                                </Typography>
                            </Grid>

                        </Grid>

                        {isPaused ? (
                            <div
                                style={{
                                    marginLeft: 59,
                                    marginTop: 110
                                }}
                            >
                                <Button
                                    onClick={onPause}
                                    endIcon={<Iconify width={64} icon="mdi:play" color='white' sx={{ pr: 1 }} />}
                                    sx={{
                                        border: "1px solid #00A76F",
                                        borderRadius: '50%',
                                        padding: '15px',
                                        backgroundColor: '#00A76F',
                                        mr: 3,
                                        '&:hover': {
                                            backgroundColor: '#00A76F',
                                        },
                                        '&:active': {
                                            backgroundColor: '#00A76F',
                                        },
                                        '&:focus': {
                                            backgroundColor: '#00A76F',
                                        },
                                    }}
                                >
                                </Button>
                                <Button
                                    onClick={onEnd}
                                    endIcon={<Iconify width={64} icon="material-symbols:stop" color='white' sx={{ pr: 1.8 }} />}
                                    sx={{

                                        border: "1px solid #ee7b70",
                                        borderRadius: '50%',
                                        padding: '15px',
                                        backgroundColor: '#ee7b70',
                                        mr: 3,
                                    }}
                                >
                                </Button>
                            </div>
                        ) : (

                            <div
                                style={{
                                    marginLeft: 120,
                                    marginTop: 110
                                }}
                            >
                                <Button
                                    color="primary"
                                    onClick={onPause}
                                    endIcon={<Iconify width={64} icon="material-symbols:pause" color='black' sx={{ pr: 1.8 }} />}
                                    sx={{
                                        border: "1px solid white",
                                        borderRadius: '50%',
                                        padding: '15px',
                                        backgroundColor: 'white',
                                        mr: 3,
                                        '&:hover': {
                                            backgroundColor: 'white',
                                        },
                                        '&:active': {
                                            backgroundColor: 'white',
                                        },
                                        '&:focus': {
                                            backgroundColor: 'white',
                                        },
                                    }}
                                >
                                </Button>
                            </div>
                        )}
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
                                    color: "#807b88"
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
                                    color: "#807b88"
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
                                    color: "#807b88"
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