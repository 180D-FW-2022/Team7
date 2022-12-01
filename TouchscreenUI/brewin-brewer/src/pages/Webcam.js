import React, {useEffect, useRef} from 'react';
import { createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@emotion/react';

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

function Webcam() {
  const videoRef = useRef(null);

  useEffect(() => {
    getVideo();
  }, [videoRef]);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({video: {width: 300}})
      .then(stream => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch(err => {
        console.error("error:", err);
      });
  };

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
            </Toolbar>
        </AppBar>
        <Box display="flex" justifyContent="center" alignItems="center" height="70vh" bgcolor={theme.palette.secondary}>
          <video ref={videoRef}/>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" height="20vh">
          <Button variant="contained" href="/">
              Back to Start
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Webcam;
