import React, { Component } from 'react';
import { createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { TextField } from '@mui/material';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CancelIcon from '@mui/icons-material/Cancel';
import { Button } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { db } from '../utils/firebase';
import { get, query, ref, update, set } from "firebase/database";

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

class DeviceManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
        currentView: "manage",
        devices: [],
        currentDevice: "",
        currentMenu: [],
        inputTank1: "",
        inputTank2: "",
        inputTank3: "",
        inputingredient1Oz: "",
        inputingredient2Oz: "",
        inputingredient3Oz: "",
        inputItem: "",
        inputCost: "",
        inputVenmoUsername: "",
        inputVenmoPassword: "",
        inputNewDeviceID: "",
        adminID: ""
    }
  }

  componentDidMount() {
    this.retrieveDeviceData();
  }

  updateCurrentDeviceView(deviceID) {
    var data = null;
    get(query(ref(db, `Admins/${this.state.adminID}/devices/${deviceID}`))).then((snapshot) => {
      if (snapshot.exists()) {
        data = snapshot.val();
        const tank1 = data["tank1"];
        const tank2 = data["tank2"];
        const tank3 = data["tank3"];
        const menu = data["Menu"];
        const venmoUsername = data["venmoUsername"];
        const venmoPassword = data["venmoPassword"];
        console.log(data);
        this.setState({currentDevice: deviceID, inputTank1: tank1, inputTank2: tank2, inputTank3: tank3, currentMenu: menu, inputVenmoUsername: venmoUsername, inputVenmoPassword: venmoPassword});
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  updateTankIngredients(deviceID) {
    const updates = {};
    updates[`Admins/${this.state.adminID}/devices/${deviceID}/tank1`] = this.state.inputTank1;
    updates[`Admins/${this.state.adminID}/devices/${deviceID}/tank2`] = this.state.inputTank2;
    updates[`Admins/${this.state.adminID}/devices/${deviceID}/tank3`] = this.state.inputTank3;
    update(ref(db), updates).then(() => {
      console.log("Tank Ingredients Updated");
    }).catch((error) => {
      console.error(error);
      return false;
    });
  }

  updateVenmoSettings(deviceID) {
    const updates = {};
    updates[`Admins/${this.state.adminID}/devices/${deviceID}/venmoUsername`] = this.state.inputVenmoUsername;
    updates[`Admins/${this.state.adminID}/devices/${deviceID}/venmoPassword`] = this.state.inputVenmoPassword;
    update(ref(db), updates).then(() => {
      console.log("Venmo Info Updated");
    }).catch((error) => {
      console.error(error);
      return false;
    });
  }

  retrieveDeviceData() {
    var data = null;
    const adminID = sessionStorage.getItem("adminID");
    this.setState({adminID: adminID});
    get(query(ref(db, `Admins/${adminID}/devices`))).then((snapshot) => {
      if (snapshot.exists()) {
        data = snapshot.val();
        this.setState({devices: data});
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  deleteMenuItem(menuItem) {
    const updates = {};
    updates[`Admins/${this.state.adminID}/devices/${this.state.currentDevice}/Menu/${menuItem}`] = null;
    update(ref(db), updates).then(() => {
      console.log("Menu Item Deleted");
      window.location.reload();
    }).catch((error) => {
      console.error(error);
      return false;
    });
  }

  updateMenuItems(menuItem) {
    if((parseInt(this.state.inputingredient1Oz) + parseInt(this.state.inputingredient2Oz) + parseInt(this.state.inputingredient3Oz)) > 9) {
      // Max amount of ounces per drink is 9
      console.log("CANNOT ADD DRINK: SURPASSES MAX OUNCES PER CUP");
      return false;
    }
    set(ref(db, `Admins/${this.state.adminID}/devices/${this.state.currentDevice}/Menu/${menuItem}`), {
      cost: this.state.inputCost,
      tank1: this.state.inputingredient1Oz,
      tank2: this.state.inputingredient2Oz,
      tank3: this.state.inputingredient3Oz
    }).then(() => {
      console.log("Item successfully added");
      window.location.reload();
      return true;
    }).catch((error) => {
      console.error(error);
      return false;
    });
  }

  addNewDevice() {
    set(ref(db, `Admins/${this.state.adminID}/devices/${this.state.inputNewDeviceID}`), {
      tank1: "N/A",
      tank2: "N/A",
      tank3: "N/A",
      venmoUsername: "N/A",
      venmoPassword: "N/A",
      Menu: {
        ExampleItem: {
          cost: 100,
          tank1: 1,
          tank2: 1,
          tank3: 1
        }
      }
    }).then(() => {
      console.log("New Device Added");
      window.location.reload();
      return true;
    }).catch((error) => {
      console.error(error);
      return false;
    });
  }

  deleteDevice() {
    const updates = {};
    updates[`Admins/${this.state.adminID}/devices/${this.state.currentDevice}`] = null;
    update(ref(db), updates).then(() => {
      console.log("Device Deleted");
      window.location.reload();
    }).catch((error) => {
      console.error(error);
      return false;
    });
  }

  handleTank1FieldChange (ingredient) {
    this.setState({inputTank1: ingredient});
  }

  handleTank2FieldChange (ingredient) {
    this.setState({inputTank2: ingredient});
  }

  handleTank3FieldChange (ingredient) {
    this.setState({inputTank3: ingredient});
  }

  handleIngredient1OzFieldChange (oz) {
    this.setState({inputingredient1Oz: oz});
  }

  handleIngredient2OzFieldChange (oz) {
    this.setState({inputingredient2Oz: oz});
  }

  handleIngredient3OzFieldChange (oz) {
    this.setState({inputingredient3Oz: oz});
  }

  handleCostFieldChange (cost) {
    this.setState({inputCost: cost});
  }

  handleItemFieldChange (item) {
    this.setState({inputItem: item});
  }

  handleVenmoUsernameFieldChange (username) {
    this.setState({inputVenmoUsername: username});
  }

  handleVenmoPasswordFieldChange (password) {
    this.setState({inputVenmoPassword: password});
  }

  handleNewDeviceIDFieldChange (deviceID) {
    this.setState({inputNewDeviceID: deviceID});
  }

  CentsToDollar(cents) {
    const dollars = parseInt(cents/100);
    var centsLeft = cents - dollars*100;
    if (centsLeft < 10) {
      centsLeft = `0${centsLeft}`;
    }
    return `$${dollars}.${centsLeft}`;
  }


  currentView () {
    switch(this.state.currentView) {
        case "manage":
          return (
            <ThemeProvider theme={theme}>
              <Box height="100vh" width="100vw">
                <Box height="10vh" width="100vw">
                  <AppBar position="static" style={{minHeight: "100%", justifyContent: "center"}}>
                    <Toolbar disableGutters>
                      <SportsBarIcon color='info' sx={{ display: { xs: 'none', md: 'flex' }, mr: 3, ml: 6, fontSize: "50px" }}/>
                      <Typography
                          variant="h3"
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
                </Box>
                <Box height="90vh" width="100vw" display="flex" justifyContent="center" flexDirection="row" alignItems="center">
                  <Box width="30vw" height="100%" bgcolor={theme.palette.secondary.main}>
                    {this.state.devices &&
                      Object.entries(this.state.devices).map((item) => (
                        <Button variant="contained" color={this.state.currentDevice === item[0] ? "info" : "success"} fullWidth sx={{fontSize: "50px"}} onClick={() => this.updateCurrentDeviceView(item[0])}>{item[0]}</Button>
                      ))
                    }
                  </Box>
                  <Box width="70vw" height="100%" sx={{background: "linear-gradient(-45deg, #0D698B, #F2F1E8, #E34234)"}}>
                    {this.state.currentDevice !== "" &&
                    <Box width="100%" height="100%">
                      <Box height="20%" width="100%" display="flex" justifyContent="center" flexDirection="column" alignItems="center">
                        <Typography
                        variant="h4"
                        component="a"
                        sx={{
                          display: { xs: 'none', md: 'flex', justifyContent: 'center' },
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: theme.palette.primary.main,
                          textDecoration: 'none'
                        }}
                        >
                        Tank Ingredients
                        </Typography>
                        <Box width="100%" display="flex" justifyContent="space-evenly">
                          <TextField id="Tank 1" onChange={(event) => {this.handleTank1FieldChange(event.target.value)}} defaultValue={this.state.inputTank1} label="Tank 1" variant="filled" margin="normal" sx={{width: '20%', bgcolor: "white"}}/>
                          <TextField id="Tank 2" onChange={(event) => {this.handleTank2FieldChange(event.target.value)}} defaultValue={this.state.inputTank2} label="Tank 2" variant="filled" margin="normal" sx={{width: '20%', bgcolor: "white"}}/>
                          <TextField id="Tank 3" onChange={(event) => {this.handleTank3FieldChange(event.target.value)}} defaultValue={this.state.inputTank3} label="Tank 3" variant="filled" margin="normal" sx={{width: '20%', bgcolor: "white"}}/>
                          <Button variant='contained' onClick={() => this.updateTankIngredients(this.state.currentDevice)} sx={{marginY: "10px"}}>Update</Button>
                        </Box>
                      </Box>
                      <Box height="35%" width="100%" display="flex" justifyContent="center" flexDirection="column" alignItems="center">
                        <Typography
                        variant="h4"
                        component="a"
                        sx={{
                          display: { xs: 'none', md: 'flex', justifyContent: 'center' },
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: theme.palette.primary.main,
                          textDecoration: 'none'
                        }}
                        >
                        Menu Items
                        </Typography>
                        {this.state.currentMenu &&
                          Object.entries(this.state.currentMenu).map((item) => (
                            <Box display="flex" justifyContent="space-between" alignItems="center" width="75%">
                              <Typography
                              variant="h6"
                              component="a"
                              sx={{
                                display: { xs: 'none', md: 'flex', justifyContent: 'center' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                color: theme.palette.primary.main,
                                textDecoration: 'none'
                              }}
                              >
                              Item: {item[0]} Cost: {this.CentsToDollar(item[1]['cost'])} Tank 1: {item[1]['tank1']}oz Tank 2: {item[1]['tank2']}oz Tank 3: {item[1]['tank3']}oz 
                              </Typography>
                              <CancelIcon color='info' onClick={() => this.deleteMenuItem(item[0])} sx={{ display: { xs: 'none', md: 'flex' }, fontSize:'45px' }}/>
                            </Box>
                          ))
                        }
                        <Box display="flex" justifyContent="space-evenly" alignItems="center">
                          <TextField id="Item Name" onChange={(event) => {this.handleItemFieldChange(event.target.value)}} label="Item Name" variant="filled" margin="normal" sx={{width: '20%', bgcolor: "white"}}/>
                          <TextField id="Cost" onChange={(event) => {this.handleCostFieldChange(event.target.value)}} label="Cost (cents)" variant="filled" margin="normal" sx={{width: '10%', bgcolor: "white"}}/>
                          <TextField id="Tank 1 Oz" onChange={(event) => {this.handleIngredient1OzFieldChange(event.target.value)}} label="Tank 1 Oz" variant="filled" margin="normal" sx={{width: '10%', bgcolor: "white"}}/>
                          <TextField id="Tank 2 Oz" onChange={(event) => {this.handleIngredient2OzFieldChange(event.target.value)}} label="Tank 2 Oz" variant="filled" margin="normal" sx={{width: '10%', bgcolor: "white"}}/>
                          <TextField id="Tank 3 Oz" onChange={(event) => {this.handleIngredient3OzFieldChange(event.target.value)}} label="Tank 3 Oz" variant="filled" margin="normal" sx={{width: '10%', bgcolor: "white"}}/>
                        <Button variant='contained' onClick={() => this.updateMenuItems(this.state.inputItem)} >Add Item</Button>
                        </Box>
                      </Box>
                      <Box height="20%" width="100%" display="flex" justifyContent="center" flexDirection="column" alignItems="center">
                        <Box height="20%" width="100%" display="flex" justifyContent="center" flexDirection="column" alignItems="center">
                          <Typography
                          variant="h4"
                          component="a"
                          sx={{
                            display: { xs: 'none', md: 'flex', justifyContent: 'center' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: theme.palette.primary.main,
                            textDecoration: 'none'
                          }}
                          >
                          Venmo Settings
                          </Typography>
                          <Box width="100%" display="flex" justifyContent="space-evenly">
                            <TextField id="Venmo Username" onChange={(event) => {this.handleVenmoUsernameFieldChange(event.target.value)}} defaultValue={this.state.inputVenmoUsername} label="Venmo Username" variant="filled" margin="normal" sx={{width: '30%', bgcolor: "white"}}/>
                            <TextField id="Venmo Password" onChange={(event) => {this.handleVenmoPasswordFieldChange(event.target.value)}} defaultValue={this.state.inputVenmoPassword} label="Venmo Password" variant="filled" margin="normal" sx={{width: '30%', bgcolor: "white"}}/>
                            <Button variant='contained' onClick={() => this.updateVenmoSettings(this.state.currentDevice)} sx={{marginY: "10px"}}>Update</Button>
                          </Box>
                        </Box>
                        </Box>
                        <Box height="25%" width="100%" display="flex" justifyContent="center" flexDirection="column" alignItems="center">
                          <Box height="25%" width="100%" display="flex" justifyContent="center" flexDirection="column" alignItems="center">
                            <Typography
                            variant="h4"
                            component="a"
                            sx={{
                              display: { xs: 'none', md: 'flex', justifyContent: 'center' },
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              color: theme.palette.primary.main,
                              textDecoration: 'none'
                            }}
                            >
                            Device Settings
                            </Typography>
                            <Box width="100%" display="flex" justifyContent="space-evenly">
                              <TextField id="newDeviceID" onChange={(event) => {this.handleNewDeviceIDFieldChange(event.target.value)}} label="New Device ID" variant="filled" margin="normal" sx={{width: '60%', bgcolor: "white"}}/>
                              <Button variant='contained' onClick={() => this.addNewDevice()} sx={{marginY: "10px"}}>Add New Device</Button>
                            </Box>
                            <Button variant='contained' onClick={() => this.deleteDevice()} sx={{width: "80%", fontSize: "20px"}}>Delete This Device</Button>
                        </Box>
                        </Box>
                      </Box>
                    }
                  </Box>
                </Box>
              </Box>
            </ThemeProvider>
          );
        default:
          // no longer need sensor info (add/remove menu items, add new device, edit what is in each tank, payment history)
            return(
                <Box>
                    <Button href='/'>Error: Please Exit this page</Button>
                </Box>
            );
    }
  }
  
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Box height="100vh" width="100vw" display="grid" justifyContent="center" alignContent="center">
            {this.currentView()}
        </Box>
      </ThemeProvider>
    );
  }
}

export default DeviceManagement;
