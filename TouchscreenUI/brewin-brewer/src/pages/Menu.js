import React, { Component } from 'react';
import { createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Fab from '@mui/material/Fab';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@emotion/react';
import { db } from '../utils/firebase';
import { get, query, ref } from "firebase/database";
import MicIcon from '@mui/icons-material/Mic';
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

class Menu extends Component {

  constructor(props) {
    super(props);
    this.state = {
        menuItems: [],
        customerData: [],
        customerTab: [],
    }
  }

  componentDidMount() {
    this.retrieveMenuData('fabcas01', '0000000');
    this.retrieveCustomerData('fabcas01', 'fabcas01');
    const timeout = setTimeout(() => {
      window.location.replace('/')
  }, 300000); //render for 5 minutes and then push to start if nothing done

      return () => clearTimeout(timeout);
  }

  retrieveCustomerData(adminID, customerID) { 
    var data = null;
    get(query(ref(db, `Admins/${adminID}/customers/${customerID}`))).then((snapshot) => {
      if (snapshot.exists()) {
        data = snapshot.val();
        this.setState({customerData: data, customerTab: data['tab']});
        //console.log(Object.entries(data));
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
    return data;
  }

  retrieveMenuData(adminID, deviceID) {
    var data = null;
    get(query(ref(db, `Admins/${adminID}/devices/${deviceID}/Menu`))).then((snapshot) => {
      if (snapshot.exists()) {
        data = snapshot.val();
        this.setState({menuItems: data});
        //console.log(Object.values(data));
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
    return data;
  }

  CentsToDollar(cents) {
    const dollars = parseInt(cents/100);
    var centsLeft = cents - dollars*100;
    if (centsLeft < 10) {
      centsLeft = `0${centsLeft}`;
    }
    return `$${dollars}.${centsLeft}`;
  }

  exit() {
    // add function to clear data here

    window.location.replace('/'); //goes back to start
   }

  render() {
    const menuButtonPadding = `${16/Object.keys(this.state.menuItems).length}rem`;
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
            <Box display="flex" justifyContent="center" alignItems="center" height="90vh">
                <Box display="block" justifyContent="center" alignItems="center" width="60vw" height="100%" bgcolor={theme.palette.secondary.main}>
                    <Box display="flex" justifyContent="center" alignItems="center" height="10%" width="100%" bgcolor={theme.palette.secondary.main}>
                        <Typography
                        variant="h4"
                        component="a"
                        sx={{
                        display: { xs: 'none', md: 'flex' },
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.25rem',
                        color: 'primary.main',
                        textDecoration: 'underline',
                        }}
                        >
                        Menu
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="center" alignItems="center" height="10%" width="100%" bgcolor={theme.palette.secondary.main}>
                        <Typography
                        variant="h6"
                        component="a"
                        sx={{
                        display: { xs: 'none', md: 'flex' },
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.25rem',
                        color: 'primary.main',
                        textDecoration: 'none',
                        }}
                        >
                        Tap to make drink!
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-evenly" alignItems="center" height="65%" width="100%" bgcolor={theme.palette.secondary.main}>
                        {this.state.menuItems &&
                          Object.entries(this.state.menuItems).map((item) => (
                            <Box display="block">
                              <Box display="block" justifyContent="center" alignItems="center" height="80%">
                                <Fab color="info" href='/' sx={{p:menuButtonPadding, m:'auto'}}>
                                    <Typography
                                    sx={{
                                        display: { xs: 'none', md: 'flex' },
                                        fontFamily: 'arial',
                                        fontWeight: 'bold',
                                        fontSize: '1.25em',
                                        letterSpacing: '.25rem',
                                        color: 'secondary.main',
                                        textDecoration: 'none',
                                    }}
                                    >
                                    {item[0]}
                                    </Typography>
                                </Fab>
                              </Box>
                              <Box display="block" justifyContent="center" alignItems="center" height="20%" bgcolor={theme.palette.secondary.main}>
                                <Typography
                                  component="a"
                                  sx={{
                                  display: { xs: 'none', md: 'block' },
                                  fontFamily: 'monospace',
                                  fontWeight: 700,
                                  fontSize: '2em',
                                  letterSpacing: '.25rem',
                                  color: 'primary.main',
                                  textDecoration: 'none',
                                  paddingTop: '5px',
                                  }}
                                  >
                                  {this.CentsToDollar(item[1]['cost'])}
                                  </Typography>
                              </Box>
                            </Box>
                          ))
                        }
                    </Box>
                    <Box display="flex" height="15%" width="100%" bgcolor={theme.palette.secondary.main}>
                      <Fab color="primary" href='/' sx={{ml:'20px'}}>
                        <MicIcon/>
                      </Fab>
                    </Box>
                 </Box>
                <Box display="block" justifyContent="center" alignItems="center" width="40vw" height="100%" bgcolor={theme.palette.success.main}>
                    <Box display="flex" justifyContent="center" alignItems="center" height="10%" width="100%" bgcolor={theme.palette.success.main}>
                        <Typography
                        variant="h4"
                        component="a"
                        sx={{
                        display: { xs: 'none', md: 'flex', marginLeft: '5px', marginRight: '5px'},
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.25rem',
                        color: 'secondary.main',
                        textDecoration: 'underline',
                        }}
                        >
                        Open Tab
                        </Typography>
                    </Box>
                    <Box display="block" justifyContent="center" alignItems="center" height="60%" width="100%" bgcolor={theme.palette.success.main}>
                    { this.state.customerData &&
                      Object.entries(this.state.customerTab).map((item) => (
                        <Box display="flex" justifyContent="space-between" paddingTop="15px">
                          <Typography
                          variant="h6"
                          component="a"
                          sx={{
                          display: { xs: 'none', md: 'flex', marginLeft: '10px', marginRight: '10px' },
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          letterSpacing: '.25rem',
                          color: 'secondary.main',
                          textDecoration: 'none',
                          }}
                          >
                          {item[1]['qty']}
                          </Typography>
                          <Typography
                          variant="h6"
                          component="a"
                          sx={{
                          display: { xs: 'none', md: 'flex' },
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          letterSpacing: '.25rem',
                          color: 'secondary.main',
                          textDecoration: 'none',
                          }}
                          >
                          {item[0]}
                          </Typography>
                          <Typography
                          variant="h6"
                          component="a"
                          sx={{
                          display: { xs: 'none', md: 'flex', marginLeft: '10px', marginRight: '10px' },
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          letterSpacing: '.25rem',
                          color: 'secondary.main',
                          textDecoration: 'none',
                          }}
                          >
                          {this.CentsToDollar(item[1]['subTotal'])}
                          </Typography>
                        </Box>
                      ))
                    }
                    </Box>
                    <Box display="flex" justifyContent="center" alignItems="center" height="15%" width="100%" bgcolor={theme.palette.success.main}>
                        <Typography
                        variant="h5"
                        component="a"
                        sx={{
                        display: { xs: 'none', md: 'flex', marginLeft: '5px', marginRight: '5px' },
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.25rem',
                        color: 'secondary.main',
                        textDecoration: 'none',
                        }}
                        >
                        Total Cost: {this.CentsToDollar(this.state.customerData['totalCost'])}
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="center" alignItems="center" height="10%" width="100%" bgcolor={theme.palette.success.main}>
                        <Button variant="contained" color="cash" href="/qrcodereader">
                          <ShoppingCartCheckoutIcon color="secondary" sx={{mr: '10px'}}/>
                          <Typography
                          variant="h5"
                          component="a"
                          sx={{
                          display: { xs: 'none', md: 'flex'},
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          letterSpacing: '.25rem',
                          color: 'secondary.main',
                          textDecoration: 'none',
                          }}
                          >
                          Pay Now
                          </Typography>
                        </Button>
                    </Box>
                </Box>
            </Box>
            { /*
            <Box display="flex" justifyContent="center" alignItems="center" height="10vh">
            <Button variant="contained" href="/">
                Back to Start
            </Button>
            </Box>
                        */}
        </Box>
        </ThemeProvider>
    );
 }
}

export default Menu;
