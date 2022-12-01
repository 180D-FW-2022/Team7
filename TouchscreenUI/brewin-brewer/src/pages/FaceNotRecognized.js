import React, {useEffect} from 'react';
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

function FaceNotRecognized() {

  useEffect(() => {
    const timeout = setTimeout(() => {
        window.location.replace('/idbarcode');
        
    }, 5000); //render for 5 seconds and then push to start

        return () => clearTimeout(timeout);
    }, []);

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
        <Box display="flex" justifyContent="center" alignItems="center" height="40vh" bgcolor={theme.palette.secondary.main}>
            <Typography
                variant="h2"
                component="a"
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  color: theme.palette.primary,
                  textDecoration: 'none',
                }}
              >
                Welcome!
            </Typography>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" height="40vh" bgcolor={theme.palette.secondary.main}>
            <Typography
                variant="h4"
                component="a"
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  color: theme.palette.primary,
                  textDecoration: 'none',
                }}
              >
                Please pull out a form of government-issued ID
              </Typography>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" height="40vh" bgcolor={theme.palette.secondary.main}>
            <Typography
                variant="h4"
                component="a"
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  color: theme.palette.primary,
                  textDecoration: 'none',
                }}
              >
                
            </Typography>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" height="10vh">
          <Button variant="contained" href="/">
              Back to Start
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default FaceNotRecognized;
