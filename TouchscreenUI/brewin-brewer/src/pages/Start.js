import React, { Component } from 'react';
import { createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@emotion/react';
import { db } from '../utils/firebase';
import { get, query, ref, update } from "firebase/database";

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

const loginVenmo = async () => {
  const venmoUsername = sessionStorage.getItem("venmoUsername");
  const venmoPassword = sessionStorage.getItem("venmoPassword");
  const url = `http://localhost:9999/venmoLogin/${venmoUsername}/${venmoPassword}`;
  fetch(url)
   .then(response => response.json())
   .then(json => {
       console.log('parsed json', json) // access json.body here
   })
}

class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    // get device and admin info
    const data = require('../utils/admin.json');
    console.log(data);
    sessionStorage.setItem("adminID", data['adminUsername']);
    sessionStorage.setItem("deviceID", data['deviceID']);
    this.retrieveAdminVenmoData(data['adminUsername'], data['deviceID']);
  }

  retrieveAdminVenmoData(adminID, deviceID) { 
    var data = null;
    get(query(ref(db, `Admins/${adminID}/devices/${deviceID}`))).then((snapshot) => {
      if (snapshot.exists()) {
        data = snapshot.val();
        sessionStorage.setItem("venmoUsername", data['venmoUsername']);
        sessionStorage.setItem("venmoPassword", data['venmoPassword']);
        loginVenmo();
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
    return data;
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
              </Toolbar>
          </AppBar>
          <Box display="flex" height="calc(100vh - 64px)" justifyContent="center" alignItems="center" bgcolor={theme.palette.secondary.main}>
            <Fab color="success" href='/qrcodereader' aria-label="start" sx={{p:23}}>
              <Typography
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'arial',
                  fontWeight: 'bold',
                  fontSize: '50px',
                  letterSpacing: '.25rem',
                  color: theme.palette.secondary.main,
                  textDecoration: 'none',
                }}
              >
                Tap to Start
              </Typography>
            </Fab>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }
}

export default Start;
