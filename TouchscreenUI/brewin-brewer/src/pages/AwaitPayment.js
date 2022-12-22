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
});

class AwaitPayment extends Component {

  constructor(props) {
    super(props);
    this.state = {
        paymentReceived: false,
        timeLeft: "00:00"
    }
  }

  componentDidMount() {
    const timeoutMs = 300000;
    const timeout = setTimeout(() => {
        //add function that cancels payment request
        window.location.replace('/menu'); 
        }, timeoutMs); //render for 5 minutes and then go back to menu
    const startTime = (new Date()).getTime();

    const interval = setInterval(() => {
        const timeLeft = timeoutMs - ((new Date()).getTime() - startTime);

        this.setState({timeLeft: this.milliToTime(timeLeft)});
        
        }, 500); //update timeLeft every half second

        return () => {clearTimeout(timeout); clearInterval(interval)};
    }

    exit() {
        // add function to clear data here
    
        window.location.replace('/'); //goes back to start
       }

   milliToTime(ms) {
        const minutes = parseInt(ms/60000);
        const seconds = parseInt((ms - (minutes*60000))/1000);
        var minutesStr = "";
        var secondsStr = "";
        if (minutes < 10) {
            minutesStr = `0${minutes}`;
        }
        else {
            minutesStr = `${minutes}`;
        }
        if (seconds < 10) {
            secondsStr = `0${seconds}`;
        }
        else {
            secondsStr = `${seconds}`;
        }
        return minutesStr + ':' + secondsStr;
   }

   closeSession() {
    this.setState({paymentReceived: true});
    // add function to clear data here

    const timeoutMs = 3000;
    const timeout = setTimeout(() => {
        window.location.replace('/'); //goes back to start
        }, timeoutMs); //delay for 3 seconds and then push to start
    
    return () => clearTimeout(timeout);
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
                    Please Accept the Requested Amount of Payment on Venmo
                </Typography>
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center" height="60vh" bgcolor={theme.palette.secondary.main}>
                {!this.state.paymentReceived &&
                <Box display="block" justifyContent="center" alignItems="center">
                    <CircularProgress/>
                    <Typography
                        variant="h6"
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
                        Awaiting Payment
                    </Typography>
                    <Typography
                        variant="h6"
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
                        {this.state.timeLeft}
                    </Typography>
                </Box>
                }
                {this.state.paymentReceived &&
                  <Box display="block" justifyContent="center" alignItems="center">
                    <CheckCircleIcon sx={{fontSize: 60}}/>
                    <Typography
                        variant="h6"
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
                        Payment Complete
                    </Typography>
                    <Typography
                        variant="h6"
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
                        Thank you!
                    </Typography>
                  </Box>
                }
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center" height="10vh">
            <Button variant="contained" href="/">
                Back to Start
            </Button>
            <Button variant="contained" onClick={() => this.closeSession()}>
                Payment Received
            </Button>
            </Box>
        </Box>
        </ThemeProvider>
    );
 }
}

export default AwaitPayment;
