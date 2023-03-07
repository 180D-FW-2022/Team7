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
import { db } from '../utils/firebase';
import { ref, update } from "firebase/database";

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

const requestPayment = async () => {
       const venmoUsername = sessionStorage.getItem("venmoUsername");
       const venmoPassword = sessionStorage.getItem("venmoPassword");
       const totalCost = sessionStorage.getItem("totalCost");
       const customerID = sessionStorage.getItem("customerID");
       const url = `http://localhost:9999/requestPayment/${venmoUsername}/${venmoPassword}/${totalCost}/${customerID}`;
       return fetch(url)
        .then(response => response.json())
        .then(json => {
            console.log('parsed json', json) // access json.body here
            if(json['paid'] === 'true') {
                return true;
            }
            else {
                return false;
            }
        })
}

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
        this.exit();
        }, timeoutMs); //render for 5 minutes and then go back to start 
    const startTime = (new Date()).getTime();

    const interval = setInterval(() => {
        const timeLeft = timeoutMs - ((new Date()).getTime() - startTime);
        this.setState({timeLeft: this.milliToTime(timeLeft)});
        }, 500); //update timeLeft every half second

        sessionStorage.setItem("timeoutID", timeout.toString());
        sessionStorage.setItem("intervalID", interval.toString());

        requestPayment().then((paid) => {
            console.log(paid)
            if (paid) {
                this.paymentSuccessful()
            }
            else {
                this.exit()
            }
        });

        return () => {clearTimeout(timeout); clearInterval(interval)};
    }

    componentWillUnmount() {
        const interval = parseInt(sessionStorage.getItem("intervalID"));
        const timeout = parseInt(sessionStorage.getItem("timeoutID"));
        if (interval) {
           clearInterval(interval);
        }
        if (timeout) {
            clearTimeout(timeout);
        }
        this.exit();
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

   paymentSuccessful() {
    this.setState({paymentReceived: true});
    clearTimeout(parseInt(sessionStorage.getItem("timeoutID")));
    clearInterval(parseInt(sessionStorage.getItem("intervalID")));

    // clear tab
    const updates = {};
    updates[`Admins/${sessionStorage.getItem("adminID")}/customers/${sessionStorage.getItem("customerID")}/totalCost`] = 0;
    updates[`Admins/${sessionStorage.getItem("adminID")}/customers/${sessionStorage.getItem("customerID")}/totalQty`] = 0;
    updates[`Admins/${sessionStorage.getItem("adminID")}/customers/${sessionStorage.getItem("customerID")}/tab`] = null;
    update(ref(db), updates).then(() => {
      console.log("Customer Tab Data Updated");
    }).catch((error) => {
      console.error(error);
      return false;
    });

    const timeoutMs = 3000;
    const timeout = setTimeout(() => {
        this.exit();
        }, timeoutMs); //delay for 3 seconds and then push to start
    
    return () => clearTimeout(timeout);
   }

   exit() {
    // clear data
    clearTimeout(parseInt(sessionStorage.getItem("timeoutID")));
    clearInterval(parseInt(sessionStorage.getItem("intervalID")));
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
            <Box display="flex" justifyContent="center" alignItems="center" height="70vh" bgcolor={theme.palette.secondary.main}>
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
        </Box>
        </ThemeProvider>
    );
 }
}

export default AwaitPayment;
