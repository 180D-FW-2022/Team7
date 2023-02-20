import React, { Component } from 'react';
import { createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@emotion/react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { CircularProgress } from '@mui/material';
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

var client = "";

class DrinkBeingMade extends Component {

  constructor(props) {
    super(props);
    this.state = {
        drinkComplete: false,
        client: "",
        connectUrl: ""
    }
  }

  componentDidMount() {
    //MQTT
    const mqtt = require('mqtt');
    const host = "test.mosquitto.org";
    const port = 8080;
    const clientID = sessionStorage.getItem("deviceID");
    const topic = `BrewinBrewer/${sessionStorage.getItem("deviceID")}/DispenseSystem`;
    const connectUrl = `ws://${host}:${port}/mqtt`;
    client = mqtt.connect(connectUrl, {
      clientId: clientID,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000
    });
    client.on('connect', () => {
      console.log('Connected');
      client.subscribe([topic], () => {
        console.log(`Subscribe to topic '${topic}'`)
      });
    });
    client.on('message', (topic, payload) => {
      console.log("Received Message", topic, payload.toString());
      if (payload.toString() === "done") {
        this.drinkCompleted();
      }
    });

    const timeoutMs = 300000;
    const timeout = setTimeout(() => {
        this.exit();
        }, timeoutMs); //render for 5 minutes and then go back to start 
        
        sessionStorage.setItem("timeoutID", timeout.toString());
        return () => clearTimeout(timeout);
    }

   exit() {
    // clear data
    clearTimeout(parseInt(sessionStorage.getItem("timeoutID")));
    sessionStorage.clear();
    window.location.href = "/"; //goes back to start
   }

   drinkCompleted() {
    this.setState({drinkComplete: true});
    const timeoutMs = 3000;
    const timeout = setTimeout(() => {
        console.log("drink complete");
        this.exit();
        }, timeoutMs); //render for 5 minutes and then go back to start 
    return () => clearTimeout(timeout);
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
            <Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 64px)" bgcolor={theme.palette.secondary.main}>
                {!this.state.drinkComplete &&
                <Box display="block" justifyContent="center" alignItems="center">
                    <CircularProgress sx={{fontSize: 60}}/>
                    <Typography
                        variant="h4"
                        noWrap
                        component="a"
                        sx={{
                        display: { xs: 'none', md: 'block' },
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                        }}
                    >
                        Creating Magic
                    </Typography>
                </Box>
                }
                {this.state.drinkComplete &&
                  <Box display="block" justifyContent="center" alignItems="center">
                    <CheckCircleIcon sx={{fontSize: 60}}/>
                    <Typography
                        variant="h4"
                        noWrap
                        component="a"
                        sx={{
                        display: { xs: 'none', md: 'block' },
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                        }}
                    >
                        Your Drink Is Ready
                    </Typography>
                    <Typography
                        variant="h4"
                        noWrap
                        component="a"
                        sx={{
                        display: { xs: 'none', md: 'block' },
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                        }}
                    >
                        Enjoy!
                    </Typography>
                  </Box>
                }
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center" height="10vh">
            <Button variant="contained" onClick={() => this.exit()}>
                Back to Start
            </Button>
            <Button variant="contained" onClick={() => this.drinkCompleted()}>
                Drink Complete
            </Button>
            </Box>
        </Box>
        </ThemeProvider>
    );
 }
}

export default DrinkBeingMade;
