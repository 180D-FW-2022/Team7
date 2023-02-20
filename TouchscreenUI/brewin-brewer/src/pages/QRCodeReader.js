import React, {Component} from 'react';
import { createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@emotion/react';
import CancelIcon from '@mui/icons-material/Cancel';
import { db } from '../utils/firebase';
import { get, query, ref } from "firebase/database";

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

class QRCodeReader extends Component {
    constructor(props) {
        super(props);
        this.getVideo = this.getVideo.bind(this);
        this.state = {
          numberOfDrinks: 0
        }
      }
    
      componentDidMount() {
        this.getVideo();
        this.getCustomerInfo();
        const timeout = setTimeout(() => {
          this.exit();
      }, 300000); //render for 5 minutes and then push to start if nothing done
          sessionStorage.setItem("timeoutID", timeout.toString());
          return () => clearTimeout(timeout);
      }
    
      getVideo() {
        navigator.mediaDevices
          .getUserMedia({video: {width: 450}})
          .then(stream => {
            var video = document.querySelector("video");
            video.srcObject = stream;
            video.onloadedmetadata = function(e) {
              video.play();
            };
          })
          .catch(err => {
            console.error("error:", err);
          });
      };

      exit() {
        // clear data
        clearTimeout(parseInt(sessionStorage.getItem("timeoutID")));
        sessionStorage.clear();
        window.location.href = "/"; //goes back to start
       }

       goToMenu() {
        clearTimeout(parseInt(sessionStorage.getItem("timeoutID")));
        window.location.href = "/menu";
       }

       gotToInvalidQRCode() {
        clearTimeout(parseInt(sessionStorage.getItem("timeoutID")));
        window.location.href = "/invalidqrcode";
       }

       gotToSobrietyTestInstructions() { //only if had >3 drinks on tab (too easy to workaround tho) 
        clearTimeout(parseInt(sessionStorage.getItem("timeoutID")));
        window.location.href = "/sobrietytestinstructions";
       }

       getCustomerInfo() {
        sessionStorage.setItem("customerID", "fabcas01"); //will retrieve customer ID from qr code later
        this.retrieveCustomerData(sessionStorage.getItem("adminID"), sessionStorage.getItem("customerID"));
       }

       retrieveCustomerData(adminID, customerID) { 
        var data = null;
        get(query(ref(db, `Admins/${adminID}/customers/${customerID}`))).then((snapshot) => {
          if (snapshot.exists()) {
            data = snapshot.val();
            this.setState({numberOfDrinks: data['totalQty']});
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
                      <CancelIcon color='info' onClick={() => this.exit()} sx={{ display: { xs: 'none', md: 'flex' }, ml: 60, fontSize:'40px' }}/>
                    </Toolbar>
                </AppBar>
                <Box display="flex" justifyContent="center" alignItems="center" height="10vh" bgcolor={theme.palette.secondary.main}>
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
                        Please show your Venmo QR Code
                      </Typography>
                </Box>
                <Box display="flex" justifyContent="center" alignItems="center" height="calc(90vh - 64px)" bgcolor={theme.palette.secondary.main}>
                  <video/>
                </Box>
                <Box display="flex" justifyContent="center" alignItems="center" height="10vh">
                  <Button variant="contained" onClick={() => {this.state.numberOfDrinks > 3 ? this.gotToSobrietyTestInstructions() : this.goToMenu()}}>
                      Valid QR Code
                  </Button>
                  <Button variant="contained" onClick={() => this.gotToInvalidQRCode()}>
                      Invalid QR Code
                  </Button>
                </Box>
              </Box>
            </ThemeProvider>
          );
      }
}

export default QRCodeReader;
