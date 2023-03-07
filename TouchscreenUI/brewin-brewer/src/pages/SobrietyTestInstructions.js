import React, {Component} from 'react';
import { createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@emotion/react';
import CancelIcon from '@mui/icons-material/Cancel';

const theme = createTheme({
  palette: {
    primary: {
      main: '#050533',
    },
    secondary: {
      main: '#F2F1E8',
    },
    info: {
      main: '#E34234',
    },
    success: {
      main: '#0D698B',
    },
    cash: {
      main: '#0d8b2f',
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 400,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

class SobrietyTestInstructions extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    const timeout = setTimeout(() => {
      this.exit();
  }, 300000); //render for 5 minutes and then push to start if nothing done
      sessionStorage.setItem("timeoutID", timeout.toString());
      return () => clearTimeout(timeout);
  }

  goToSobrietyTest() {
    clearTimeout(parseInt(sessionStorage.getItem("timeoutID")));
    window.location.href = "/sobrietytest";
  }

  exit() {
    // clear data
    clearTimeout(parseInt(sessionStorage.getItem("timeoutID")));
    sessionStorage.clear();
    window.location.href = "/"; //goes back to start
   }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Box height="100vh">
          <AppBar position="static">
              <Toolbar disableGutters>
                <SportsBarIcon color='info' sx={{ display: { xs: 'none', md: 'flex' }, mr: 2, ml: 1 }}/>
                <Typography
                  variant="h6"
                  noWrap
                  component="a"
                  sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.25rem',
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                >
                  BREWIN' BREWS
                </Typography>
                <CancelIcon color='info' onClick={() => this.exit()} sx={{ display: { xs: 'none', md: 'flex' }, ml: 60, fontSize:'40px' }}/>
              </Toolbar>
          </AppBar>
          <Box display="flex" justifyContent="center" alignItems="center" height="calc(30vh - 64px)" bgcolor={theme.palette.secondary.main}>
              <Typography
                  variant="h3"
                  noWrap
                  component="a"
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                  }}
                >
                  Simon Says: A Sobriety Test
                </Typography>
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center" height="60vh" paddingX="50px" bgcolor={theme.palette.secondary.main}>
              <Typography
                  variant="h5"
                  component="a"
                  sx={{
                    display: { xs: 'none', md: 'contents' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                  }}
                >
                  You'll be given 1 sequence of 5 taps. The pattern 
                  will be a sequence of 5 circles, with the active 
                  circle being 
                </Typography>
                <Typography
                  variant="h5"
                  component="a"
                  sx={{
                    display: { xs: 'none', md: 'contents', paddingInline: '10px' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: theme.palette.info.main,
                    textDecoration: 'none',
                  }}
                >
                  &nbsp;Red
                </Typography>
                <Typography
                  variant="h5"
                  component="a"
                  sx={{
                    display: { xs: 'none', md: 'contents' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                  }}
                >
                  &nbsp;or
                </Typography>
                <Typography
                  variant="h5"
                  component="a"
                  sx={{
                    display: { xs: 'none', md: 'contents', paddingInline: '10px' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: theme.palette.cash.main,
                    textDecoration: 'none',
                  }}
                >
                  &nbsp;Green 
                </Typography>
                <Typography
                  variant="h5"
                  component="a"
                  sx={{
                    display: { xs: 'none', md: 'contents' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                  }}
                >
                  . Tap the IMU below when
                  the colored circle is
                </Typography>
                <Typography
                  variant="h5"
                  component="a"
                  sx={{
                    display: { xs: 'none', md: 'contents', paddingInline: '10px' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: theme.palette.cash.main,
                    textDecoration: 'none',
                  }}
                >
                  &nbsp;Green
                </Typography>
                <Typography
                  variant="h5"
                  component="a"
                  sx={{
                    display: { xs: 'none', md: 'contents' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                  }}
                >
                  &nbsp;and do not tap
                  the IMU when the circle is
                </Typography>
                <Typography
                  variant="h5"
                  component="a"
                  sx={{
                    display: { xs: 'none', md: 'contents', paddingInline: '10px' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: theme.palette.info.main,
                    textDecoration: 'none',
                  }}
                >
                  &nbsp;Red
                </Typography>
                <Typography
                  variant="h5"
                  component="a"
                  sx={{
                    display: { xs: 'none', md: 'contents' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                  }}
                >
                  . Make sure you 
                  DO THE OPPOSITE when the instruction 
                  does not start with "Simon Says". 
                </Typography>
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center" height="10vh" bgcolor={theme.palette.secondary.main}>
            <Button variant="contained" color="primary" onClick={() => this.goToSobrietyTest()}>
                Press to Begin
            </Button>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }
  
}

export default SobrietyTestInstructions;
