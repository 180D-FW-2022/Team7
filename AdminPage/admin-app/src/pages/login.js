import React, { Component } from 'react';
import { createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { TextField } from '@mui/material';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import { Button } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { db } from '../utils/firebase';
import { get, query, ref, set, update } from "firebase/database";

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

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
        currentView: "login",
        formError: "",
        inputUsername: "",
        inputPassword: "",
        inputPasswordConfirmation: "",
        inputFirstname: "",
        inputLastname: "",
        inputPin: "",
        inputVenmoUsername: "",
        inputVenmoPassword: ""
    }
  }

  handleUsernameFieldChange (username) {
    this.setState({inputUsername: username});
  }

  handlePasswordFieldChange (password) {
    this.setState({inputPassword: password});
  }

  handlePasswordConfirmationFieldChange (passwordConfirmation) {
    this.setState({inputPasswordConfirmation: passwordConfirmation});
  }

  handleFirstnameFieldChange (firstname) {
    this.setState({inputFirstname: firstname});
  }

  handleLastnameFieldChange (lastname) {
    this.setState({inputLastname: lastname});
  }

  handlePinFieldChange (pin) {
    this.setState({inputPin: pin});
  }

  handleVenmoUsernameFieldChange (username) {
    this.setState({inputVenmoUsername: username});
  }

  handleVenmoPasswordFieldChange (password) {
    this.setState({inputVenmoPassword: password});
  }

  authenticateLogin () {
    //first check if empty fields
    if ((this.state.inputUsername === "") || (this.state.inputPassword === "")) {
      this.setState({formError: "Fields cannot be empty"});
      return false;
    }

    //then try to query firebase to see if account exists
    get(query(ref(db, `Admins/${this.state.inputUsername}`))).then((snapshot) => {
      if (!snapshot.exists()) {
        this.setState({formError: "That user does not exist"});
        return false;
      } else {
        console.log("Admin exists");
        //then check if password is correct
        get(query(ref(db, `Admins/${this.state.inputUsername}/password`))).then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            if (this.state.inputPassword !== data) {
              this.setState({formError: "Incorrect Password"});
              return false;
            }
            else {
              //move to next page if successful up to this point
              sessionStorage.setItem("adminID", this.state.inputUsername);
              window.location.href='/devicemanagement';
              return true;
            }
          } 
          else {
            return false;
          }
        }).catch((error) => {
          console.error(error);
          return false;
        });
      }
    }).catch((error) => {
      console.error(error);
      return false;
    });
  }

  registerNewAdmin () {
    // check for any empty fields
    if ((this.state.inputFirstname === "") || (this.state.inputLastname === "") || (this.state.inputPassword === "") || (this.state.inputPasswordConfirmation === "") || (this.state.inputPin === "") || (this.state.inputUsername === "") || (this.state.inputVenmoUsername === "") || (this.state.inputVenmoPassword === "")) {
      this.setState({formError: "Fields cannot be empty"});
      return false;
    }

    // check if re-entered password matches
    if (this.state.inputPassword !== this.state.inputPasswordConfirmation) {
      this.setState({formError: "Passwords do not match"});
      return false;
    }

    // check if pin is made of numbers only
    if (!(/^\d+$/.test(this.state.inputPin))) {
      this.setState({formError: "Pin may only contain digits"});
      return false;
    }

    // query firebase to check if account exists already
    get(query(ref(db, `Admins/${this.state.inputUsername}`))).then((snapshot) => {
      if (snapshot.exists()) {
        this.setState({formError: "That username is taken"});
        return false;
      } else { // if made it this far, create new user in database
        set(ref(db, `Admins/${this.state.inputUsername}`), {
          customers: false,
          devices: false,
          firstName: this.state.inputFirstname,
          lastName: this.state.inputLastname,
          mostRecentTransaction: false,
          numOfOpenTabs: 0,
          password: this.state.inputPassword,
          pin: this.state.inputPin,
          totalRevenueToday: 0,
          transactions: false,
          venmoUsername: this.state.inputVenmoUsername,
          venmoPassword: this.state.inputVenmoPassword
        }).then(() => {
          console.log("Data saved successfully");
          this.moveToLoginPage();
          return true;
        }).catch((error) => {
          console.error(error);
          return false;
        });
      }
    }).catch((error) => {
      console.error(error);
      return false;
    });
  }

  passwordReset () {
     // check for any empty fields
     if ((this.state.inputUsername === "") || (this.state.inputPin === "") || (this.state.inputPassword === "")) {
      this.setState({formError: "Fields cannot be empty"});
      return false;
    }

    // check if pin is made of numbers only
    if (!(/^\d+$/.test(this.state.inputPin))) {
      this.setState({formError: "Pin may only contain digits"});
      return false;
    }

    // query firebase to check if account exists already
    get(query(ref(db, `Admins/${this.state.inputUsername}`))).then((snapshot) => {
      if (!snapshot.exists()) {
        this.setState({formError: "That user does not exist"});
        return false;
      } else { // if account exists, check if security pin is correct
        get(query(ref(db, `Admins/${this.state.inputUsername}/pin`))).then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            if(data !== parseInt(this.state.inputPin)) {
              this.setState({formError: "Pin is incorrect"});
              return false;
            } else { //input pin correct, change password and move to login page
              const updates = {};
              updates[`Admins/${this.state.inputUsername}/password`] = this.state.inputPassword;
              update(ref(db), updates).then(() => {
                console.log("Password successfully reset!");
                this.moveToLoginPage();
              }).catch((error) => {
                console.error(error);
                return false;
              });
              return true;
            }
          } else {
            return false;
          }
        }).catch((error) => {
          console.error(error);
          return false;
        });
      }
    }).catch((error) => {
      console.error(error);
      return false;
    });
  }

  moveToRegistrationPage () {
    this.setState({currentView: "register", formError: "", inputUsername: "", inputPassword: "", inputFirstname: "", inputLastname: "", inputPasswordConfirmation: "", inputPin: ""});
  }

  moveToLoginPage () {
    this.setState({currentView: "login", formError: "", inputUsername: "", inputPassword: "", inputFirstname: "", inputLastname: "", inputPasswordConfirmation: "", inputPin: ""});
  }

  moveToForgotPasswordPage () {
    this.setState({currentView: "forgotpassword", formError: "", inputUsername: "", inputPassword: "", inputFirstname: "", inputLastname: "", inputPasswordConfirmation: "", inputPin: ""});
  }

  currentView () {
    switch(this.state.currentView) {
        case "login":
            return(
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems='center' sx={{boxShadow: "10px 10px 67px -5px rgba(0,0,0,0.61)",aspectRatio: "7/9", width: "35vw", backgroundColor: "white", borderRadius: "30px"}}>
                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems='center' height="35%">
                      <SportsBarIcon color='info' sx={{ display: { xs: 'none', md: 'flex' }, fontSize: '8rem'}}/>
                      <Typography
                        variant="h3"
                        noWrap
                        component="a"
                        sx={{
                          display: { xs: 'none', md: 'flex' },
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          letterSpacing: '.25rem',
                          color: 'inherit',
                          textDecoration: 'none'
                        }}
                      >
                        BREWIN' BREWS
                      </Typography>
                    </Box>
                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems='center' height="15%">
                      <Typography
                      variant="h3"
                      component="a"
                      sx={{
                        display: { xs: 'none', md: 'flex', justifyContent: 'center' },
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                        textDecoration: 'none'
                      }}
                    >
                      Login
                    </Typography>
                    </Box>
                    {this.state.formError === "" &&
                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems='center' height="20%" width="100%">
                      <TextField id="username" onChange={(event) => {this.handleUsernameFieldChange(event.target.value)}} label="Username" variant="outlined" margin="normal" sx={{width: '65%'}}/>
                      <TextField id="password" onChange={(event) => {this.handlePasswordFieldChange(event.target.value)}} label="Password" variant="outlined" margin="normal" type="password" sx={{width: '65%'}}/>
                    </Box>
                    }
                    {this.state.formError !== "" &&
                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems='center' height="20%" width="100%">
                      <TextField error id="username" onChange={(event) => {this.handleUsernameFieldChange(event.target.value)}} label="Username" variant="outlined" margin="normal" sx={{width: '65%'}}/>
                      <TextField error id="password" onChange={(event) => {this.handlePasswordFieldChange(event.target.value)}} label="Password" helperText={this.state.formError} variant="outlined" margin="normal" type="password" sx={{width: '65%'}}/>
                    </Box>
                    }
                  <Box display="flex" flexDirection="column" justifyContent="center" alignItems='center' height="15%">
                    <Button variant="contained" onClick={() => this.authenticateLogin()} sx={{fontSize: '20px'}}>Submit</Button>
                  </Box>
                  <Box display="flex" flexDirection="column" justifyContent="space-evenly" alignItems='center' height="15%">
                    <Button variant="text" onClick={() => this.moveToRegistrationPage()} sx={{fontSize: '15px'}}>Register a New Account?</Button>
                    <Button variant="text" onClick={() => this.moveToForgotPasswordPage()} sx={{fontSize: '15px'}}>Forgot Password?</Button>
                  </Box>
                </Box>
            );
        case "register":
          return(
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems='center' sx={{boxShadow: "10px 10px 67px -5px rgba(0,0,0,0.61)",aspectRatio: "7/9", width: "35vw", backgroundColor: "white", borderRadius: "30px"}}>
                    <Box display="flex" justifyContent="center" alignItems='center' height="5%" width="100%">
                      <SportsBarIcon color='info' sx={{ display: { xs: 'none', md: 'flex' }, fontSize: '3rem', paddingX: '1rem'}}/>
                      <Typography
                        variant="h4"
                        noWrap
                        component="a"
                        sx={{
                          display: { xs: 'none', md: 'flex' },
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          letterSpacing: '.25rem',
                          color: 'inherit',
                          textDecoration: 'none'
                        }}
                      >
                        Register
                      </Typography>
                    </Box>
                    {this.state.formError === "" &&
                    <Box display="flex" flexDirection="column" justifyContent="space-evenly" alignItems='center' height="75%" width="100%">
                      <TextField id="firstname" onChange={(event) => {this.handleFirstnameFieldChange(event.target.value)}} label="First Name" variant="outlined" margin="dense" size='small' sx={{width: '65%'}}/>
                      <TextField id="lastname" onChange={(event) => {this.handleLastnameFieldChange(event.target.value)}} label="Last Name" variant="outlined" margin="dense" size='small' sx={{width: '65%'}}/>
                      <TextField id="username" onChange={(event) => {this.handleUsernameFieldChange(event.target.value)}} label="New Username" variant="outlined" margin="dense" size='small' sx={{width: '65%'}}/>
                      <TextField id="password" onChange={(event) => {this.handlePasswordFieldChange(event.target.value)}} label="Password" variant="outlined" margin="dense" size='small' type="password" sx={{width: '65%'}}/>
                      <TextField id="passwordconfirmation" onChange={(event) => {this.handlePasswordConfirmationFieldChange(event.target.value)}} label="Re-Type Password" variant="outlined" margin="dense" size='small' type="password" sx={{width: '65%'}}/>
                      <TextField id="venmoUsername" onChange={(event) => {this.handleVenmoUsernameFieldChange(event.target.value)}} label="Venmo Username" variant="outlined" margin="dense" size='small' sx={{width: '65%'}}/>
                      <TextField id="venmoPassword" onChange={(event) => {this.handleVenmoPasswordFieldChange(event.target.value)}} label="Venmo Password" variant="outlined" margin="dense" size='small' type="password" sx={{width: '65%'}}/>
                      <TextField id="pin" onChange={(event) => {this.handlePinFieldChange(event.target.value)}} label="Pin For Password Reset" variant="outlined" margin="dense" size='small' sx={{width: '65%'}}/>
                    </Box>
                    }
                    {this.state.formError !== "" &&
                    <Box display="flex" flexDirection="column" justifyContent="space-evenly" alignItems='center' height="75%" width="100%">
                      <TextField error id="firstname" onChange={(event) => {this.handleFirstnameFieldChange(event.target.value)}} label="First Name" variant="outlined" margin="dense" size='small' sx={{width: '65%'}}/>
                      <TextField error id="lastname" onChange={(event) => {this.handleLastnameFieldChange(event.target.value)}} label="Last Name" variant="outlined" margin="dense" size='small' sx={{width: '65%'}}/>
                      <TextField error id="username" onChange={(event) => {this.handleUsernameFieldChange(event.target.value)}} label="New Username" variant="outlined" margin="dense" size='small' sx={{width: '65%'}}/>
                      <TextField error id="password" onChange={(event) => {this.handlePasswordFieldChange(event.target.value)}} label="Password" variant="outlined" margin="dense" size='small' type="password" sx={{width: '65%'}}/>
                      <TextField error id="passwordconfirmation" onChange={(event) => {this.handlePasswordConfirmationFieldChange(event.target.value)}} label="Re-Type Password" variant="outlined" margin="dense" size='small' type="password" sx={{width: '65%'}}/>
                      <TextField error id="venmoUsername" onChange={(event) => {this.handleVenmoUsernameFieldChange(event.target.value)}} label="Venmo Username" variant="outlined" margin="dense" size='small' sx={{width: '65%'}}/>
                      <TextField error id="venmoPassword" onChange={(event) => {this.handleVenmoPasswordFieldChange(event.target.value)}} label="Venmo Password" variant="outlined" margin="dense" size='small' type="password" sx={{width: '65%'}}/>
                      <TextField error id="pin" onChange={(event) => {this.handlePinFieldChange(event.target.value)}} helperText={this.state.formError} label="Pin For Password Reset" variant="outlined" margin="dense" size='small' sx={{width: '65%'}}/>
                    </Box>
                    }
                  <Box display="flex" flexDirection="column" justifyContent="space-evenly" alignItems='center' height="15%">
                    <Button variant="contained" onClick={() => this.registerNewAdmin()} sx={{fontSize: '20px'}}>Submit</Button>
                    <Button variant="text" onClick={() => this.moveToLoginPage()} sx={{fontSize: '15px'}}>Back to Login Page</Button>
                  </Box>
                </Box>
          );
          case "forgotpassword":
            return(
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems='center' sx={{boxShadow: "10px 10px 67px -5px rgba(0,0,0,0.61)",aspectRatio: "7/9", width: "35vw", backgroundColor: "white", borderRadius: "30px"}}>
                <Box display="flex" justifyContent="center" alignItems='center' height="40%" width="90%">
                  <Typography
                    variant="h4"
                    component="a"
                    sx={{
                      display: { xs: 'none', md: 'flex' },
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      letterSpacing: '.25rem',
                      color: 'inherit',
                      textDecoration: 'none'
                    }}
                  >
                    Enter your Username and Security Pin to Reset your Password
                  </Typography>
                </Box>
                {this.state.formError === "" &&
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems='center' height="40%" width="100%">
                  <TextField id="username" onChange={(event) => {this.handleUsernameFieldChange(event.target.value)}} label="Username" variant="outlined" margin="normal" sx={{width: '65%'}}/>
                  <TextField id="pin" onChange={(event) => {this.handlePinFieldChange(event.target.value)}} label="Pin For Password Reset" variant="outlined" margin="normal" sx={{width: '65%'}}/>
                  <TextField id="password" onChange={(event) => {this.handlePasswordFieldChange(event.target.value)}} label="New Password" variant="outlined" margin="normal" type="password" sx={{width: '65%'}}/>
                </Box>
                }
                {this.state.formError !== "" &&
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems='center' height="40%" width="100%">
                  <TextField error id="username" onChange={(event) => {this.handleUsernameFieldChange(event.target.value)}} label="Username" variant="outlined" margin="normal" sx={{width: '65%'}}/>
                  <TextField error id="pin" onChange={(event) => {this.handlePinFieldChange(event.target.value)}} label="Pin For Password Reset" variant="outlined" margin="normal" sx={{width: '65%'}}/>
                  <TextField error id="password" onChange={(event) => {this.handlePasswordFieldChange(event.target.value)}} label="New Password" helperText={this.state.formError} variant="outlined" margin="normal" type="password" sx={{width: '65%'}}/>
                </Box>
                }
                <Box display="flex" flexDirection="column" justifyContent="space-evenly" alignItems='center' height="20%">
                  <Button variant="contained" onClick={() => this.passwordReset()} sx={{fontSize: '20px'}}>Submit</Button>
                  <Button variant="text" onClick={() => this.moveToLoginPage()} sx={{fontSize: '15px'}}>Back to Login Page</Button>
                </Box>
              </Box>
            );
        default:
            return(
                <Box>
                    Error: Please Exit Page
                </Box>
            );
    }
  }
  
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Box height="100vh" width="100vw" display="grid" justifyContent="center" alignContent="center" sx={{background: "linear-gradient(-45deg, #0D698B, #F2F1E8, #E34234)"}}>
            {this.currentView()}
        </Box>
      </ThemeProvider>
    );
  }
}

export default Login;
