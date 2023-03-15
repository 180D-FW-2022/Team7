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
import { get, query, ref, update } from "firebase/database";
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

const getAudioText = async () => {
  const url = `http://localhost:9999/audioText/`;
  return fetch(url)
  .then(response => response.json())
  .then(json => {
      console.log('parsed json', json) // access json.body here
      if(json['text'] !== 'null') {
          return json['text'];
      }
      else {
          return null;
      }
  })
}

class Menu extends Component {

  constructor(props) {
    super(props);
    this.state = {
        menuItems: [],
        customerData: [],
        customerTab: [],
        hotMic: false,
    }
  }

  componentDidMount() {

    this.retrieveMenuData(sessionStorage.getItem("adminID"), sessionStorage.getItem("deviceID"));
    this.retrieveCustomerData(sessionStorage.getItem("adminID"), sessionStorage.getItem("customerID"));
    const timeout = setTimeout(() => {
      this.exit();
  }, 300000); //render for 5 minutes and then push to start if nothing done
      sessionStorage.setItem("timeoutID", timeout.toString());
      return () => clearTimeout(timeout);
  }

  retrieveCustomerData(adminID, customerID) { 
    var data = null;
    get(query(ref(db, `Admins/${adminID}/customers/${customerID}`))).then((snapshot) => {
      if (snapshot.exists()) {
        data = snapshot.val();
        this.setState({customerData: data, customerTab: data['tab']});
        sessionStorage.setItem("totalCost", data["totalCost"]/100);
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
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
    return data;
  }

  makeDrink(cost, item, tank1, tank2, tank3) {
    const newQtyTotal = this.state.customerData['totalQty'] + 1;
    const newCostTotal = this.state.customerData['totalCost'] + cost;
    const newItemQty = (typeof this.state.customerData['tab'][item] == 'undefined') ?  this.state.customerData['tab'][item]['qty']+ 1 : 1;
    const newSubtotalCost = (typeof this.state.customerData['tab'][item] == 'undefined') ? this.state.customerData['tab'][item]['subTotal'] + cost : cost;

    //MQTT
    const mqtt = require('mqtt');
    const host = "test.mosquitto.org";
    const port = 8080;
    const clientID = sessionStorage.getItem("deviceID");
    const connectUrl = `ws://${host}:${port}/mqtt`;
    client = mqtt.connect(connectUrl, {
      clientId: clientID,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000
    });

    const updates = {};
    updates[`Admins/${sessionStorage.getItem("adminID")}/customers/${sessionStorage.getItem("customerID")}/totalCost`] = newCostTotal;
    updates[`Admins/${sessionStorage.getItem("adminID")}/customers/${sessionStorage.getItem("customerID")}/totalQty`] = newQtyTotal;
    updates[`Admins/${sessionStorage.getItem("adminID")}/customers/${sessionStorage.getItem("customerID")}/tab/${item}/qty`] = newItemQty;
    updates[`Admins/${sessionStorage.getItem("adminID")}/customers/${sessionStorage.getItem("customerID")}/tab/${item}/subTotal`] = newSubtotalCost;
    update(ref(db), updates).then(() => {
      console.log("Customer Tab Data Updated");
      // send MQTT message to make drink
      const topic = `BrewinBrewer/${sessionStorage.getItem("deviceID")}/Touchscreen`;
      client.on('connect', () => {
        client.publish(topic, `${tank1} ${tank2} ${tank3}`, { qos: 0, retain: false }, (error) => {
          if (error) {
            console.error(error)
          }
          else {
            console.log("Message Sent");
            this.goToDrinkMakingPage();
          }
        })
      });

    }).catch((error) => {
      console.error(error);
      return false;
    });
  }

  setToListenMode() {
    this.setState({hotMic: true});
    getAudioText().then((text) => {this.audioCommand(text)});
  }

  audioCommand(text) {
    if(text === null) {
      this.setState({hotMic: false});
      return false;
    }

    //get menu items
    const menuItems = Object.entries(this.state.menuItems);

        // generate substring
        var substring = text.trim();
        substring = substring.toLowerCase();
        console.log(substring);


        //check if pay command
        if ((substring === "pay now") || (substring === "check out") || (substring === "pay") || (substring === "checkout")) {
          this.setState({hotMic: false});
          this.goToAwaitPayment();
          return true;
        }
        //check if menu item
        for (var k = 0; k < menuItems.length; k++) {
          if (substring === menuItems[k][0].trim().toLowerCase()) {
            this.setState({hotMic: false});
            this.makeDrink(parseInt(menuItems[k][1]['cost']), menuItems[k][0], menuItems[k][1]['tank1'], menuItems[k][1]['tank2'], menuItems[k][1]['tank3']);
            return true;
          }
    }
    this.setState({hotMic: false});
    return false;
  }

  CentsToDollar(cents) {
    if(!cents) {
      return "$0.00"
    }
    const dollars = parseInt(cents/100);
    var centsLeft = cents - dollars*100;
    if (centsLeft < 10) {
      centsLeft = `0${centsLeft}`;
    }
    return `$${dollars}.${centsLeft}`;
  }

  goToAwaitPayment() {
    clearTimeout(parseInt(sessionStorage.getItem("timeoutID")));
    window.location.href = "/awaitpayment";
  }

  goToDrinkMakingPage() {
    clearTimeout(parseInt(sessionStorage.getItem("timeoutID")));
    window.location.href = "/drinkbeingmade";
  }

  exit() {
    // clear data
    clearTimeout(parseInt(sessionStorage.getItem("timeoutID")));
    sessionStorage.clear();
    window.location.href = "/"; //goes back to start
   }

  render() {
    const menuButtonPadding = `${10/Object.keys(this.state.menuItems).length}rem`;
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
            <Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 64px)">
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
                                <Fab color="info" onClick={() => this.makeDrink(parseInt(item[1]['cost']), item[0], item[1]['tank1'], item[1]['tank2'], item[1]['tank3'])} sx={{p:menuButtonPadding, m:'auto'}}>
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
                      <Fab color={this.state.hotMic? "info" : "primary"} sx={{ml:'20px'}} onClick={() => this.setToListenMode()}>
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
                    { this.state.customerTab &&
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
                          variant="body1"
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
                        Total Cost: {this.CentsToDollar(this.state.customerData['totalCost'])}
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="center" alignItems="center" height="10%" width="100%" bgcolor={theme.palette.success.main}>
                        <Button variant="contained" color="cash" onClick={() => this.goToAwaitPayment()}>
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
        </Box>
        </ThemeProvider>
    );
 }
}

export default Menu;
