import React, {useEffect, useRef, Component} from 'react';
import { createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Fab from '@mui/material/Fab';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@emotion/react';
import { db } from '../utils/firebase';
import { DataSnapshot, get, query, ref } from "firebase/database";
import MicIcon from '@mui/icons-material/Mic';

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
        menuItems: ['Berry Moscow Mule'], //1 fl oz lime juice, 2 fl oz of mixed berry juice, ice, ginger beer to top 
        customerData: this.retrieveCustomerData('fabcas01', 'fabcas01') //find way to pass in these parameters
    }
  }

  retrieveCustomerData(adminID, customerID) { //problem, data not existing outside function
    var data = null;
    get(query(ref(db, `Admins/${adminID}/customers/${customerID}`))).then((snapshot) => {
      if (snapshot.exists()) {
        data = snapshot.val();
        console.log(data);
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
    return data;
  }

  CentsToDollar(cents) {
    const dollars = cents/100;
    var centsLeft = cents - dollars*100;
    if (centsLeft < 10) {
      centsLeft = `0${centsLeft}`;
    }
    return `$${dollars}.${centsLeft}`;
  }

  render() {
    //console.log(this.state.customerData);
    const totalCost = this.CentsToDollar(500); //this.state.customerData['totalCost'];
    //const lineItems = data['tab'].map((d) => <h6 key={d.item}>Qty: {d.qty} - Item: {d.item} - Subtotal: {d.subTotal}</h6>);
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
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
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
                    <Box display="block" justifyContent="center" alignItems="center" height="80%" width="100%" bgcolor={theme.palette.secondary.main}>
                        <Box display="flex" justifyContent="center" alignItems="center" height="80%">
                          <Fab color="info" href='/' aria-label="add" sx={{p:18, m:'auto'}}>
                              <Typography
                              sx={{
                                  display: { xs: 'none', md: 'flex' },
                                  fontFamily: 'arial',
                                  fontWeight: 'bold',
                                  fontSize: '40px',
                                  letterSpacing: '.25rem',
                                  color: 'secondary.main',
                                  textDecoration: 'none',
                              }}
                              >
                              {this.state.menuItems[0]}
                              </Typography>
                          </Fab>
                        </Box>
                        <Box display="flex" justifyContent="center" alignItems="center" height="20%" width="100%" bgcolor={theme.palette.secondary.main}>
                          <Typography
                            variant="h4"
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
                            $5.00
                            </Typography>
                      </Box>
                      <Fab position="absolute" color="primary" style={{bottom: '17%', left: '-44%'}}>
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
                    <Box display="flex" justifyContent="center" alignItems="center" height="60%" width="100%" bgcolor={theme.palette.success.main}>
                    <Typography
                        variant="h6"
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
                        1
                        </Typography>
                        <Typography
                        variant="h6"
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
                        Berry Moscow Mule
                        </Typography>
                        <Typography
                        variant="h6"
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
                        $5.00
                        </Typography>
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
                        Total Cost: {totalCost}
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="center" alignItems="center" height="10%" width="100%" bgcolor={theme.palette.success.main}>
                        <Button variant="contained" color="cash">
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
            <Box display="flex" justifyContent="center" alignItems="center" height="10vh">
            <Button variant="contained" href="/">
                Back to Start
            </Button>
            </Box>
        </Box>
        </ThemeProvider>
    );
 }
}

export default Menu;
