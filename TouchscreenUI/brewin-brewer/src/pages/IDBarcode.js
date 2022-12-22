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
  },
});

class IDBarcode extends Component {
  constructor(props) {
    super(props);
    this.getVideo = this.getVideo.bind(this);
    this.state = {
    }
  }

  componentDidMount() {
    this.getVideo();
    const timeout = setTimeout(() => {
      window.location.replace('/')
  }, 300000); //render for 5 minutes and then push to start if nothing done

      return () => clearTimeout(timeout);
  }

  getVideo() {
    navigator.mediaDevices
      .getUserMedia({video: {width: 500}})
      .then(stream => {
        var video = document.querySelector("video");
        video.srcObject = stream;
        video.onloadedmetadata = function(e) {
          video.play();
        };
      })
      .catch(err => {
        console.error("error:", err);
      });
  };

  exit() {
    // add function to clear data here

    window.location.replace('/'); //goes back to start
   }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Box height="100vh">
          <AppBar position="static" height="10vh">
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
                <CancelIcon color='info' onClick={() => this.exit()} sx={{ display: { xs: 'none', md: 'flex' }, ml: 88, fontSize:'45px' }}/>
              </Toolbar>
          </AppBar>
          <Box display="flex" justifyContent="center" alignItems="center" height="20vh" bgcolor={theme.palette.secondary.main}>
              <Typography
                  variant="h6"
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
                  Please show the barcode on the back of your ID
                </Typography>
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center" height="60vh" bgcolor={theme.palette.secondary.main}>
            <video/>
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center" height="10vh">
            <Button variant="contained" href="/">
                Back to Start
            </Button>
            <Button variant="contained" href="/idfacerecognition">
                Success
            </Button>
            <Button variant="contained" href="/invalidid">
                Invalid
            </Button>
            <Button variant="contained" href="/tryagain">
                Error
            </Button>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }
}

export default IDBarcode;
