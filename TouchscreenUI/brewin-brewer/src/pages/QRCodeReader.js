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
import { update, get, query, ref } from "firebase/database";
import QrScanner from 'qr-scanner';

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
        const interval = setInterval(() => {
            this.decode();
          }, 500); //check video stream for qr code every half second
          sessionStorage.setItem("intervalID", interval.toString());
  
        const timeout = setTimeout(() => {
          this.exit();
      }, 300000); //render for 5 minutes and then push to start if nothing done
          sessionStorage.setItem("timeoutID", timeout.toString());
          return () => {clearTimeout(timeout); clearInterval(interval)};
      }
    
      getVideo() {
        navigator.mediaDevices
          .getUserMedia({video: {width: 450, height: 325}})
          .then(stream => {
            this.decode(stream);
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

     /*
     getVideo() {
      const qrScanner = new QrScanner(
        videoElem,
        result => console.log('decoded qr code:', result),
        { returnDetailedScanResult: true },
      );
      qrScanner.start();
     }
     */
      decode() {
        var canvas = document.createElement('canvas');
        var video = document.querySelector("video");

        canvas.width = 450;
        canvas.height = 325;

        var ctx = canvas.getContext('2d');
        ctx.drawImage( video, 0, 0, canvas.width, canvas.height );

        var image = canvas.toDataURL('image/jpeg');
        QrScanner.scanImage(image)
        .then(result => this.parseQRCode(result))
        .catch(err => (err === "No QR code found") ? console.log(err) : this.gotToInvalidQRCode());
      }

      parseQRCode(text) {
        //parse user_id
        var url = new URL(text);
        console.log(url.hostname);
        console.log(url.searchParams.get('user_id'));
        if ((url.hostname === "venmo.com") && (url.searchParams.get('user_id') !== "")) {
          //get customer info
          this.getCustomerInfo(url.searchParams.get('user_id'));

          //go to next page
          this.state.numberOfDrinks > 3 ? this.gotToSobrietyTestInstructions() : this.goToMenu();         
        }
        else {
          this.gotToInvalidQRCode();
        }
      }

      exit() {
        // clear data
        clearTimeout(parseInt(sessionStorage.getItem("timeoutID")));
        clearInterval(parseInt(sessionStorage.getItem("intervalID")));
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

       getCustomerInfo(userID) {
        sessionStorage.setItem("customerID", userID); //will retrieve customer ID from qr code later
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
            this.setState({numberOfDrinks: 0});
            // fill in new customer data
            const updates = {};
            updates[`Admins/${sessionStorage.getItem("adminID")}/customers/${sessionStorage.getItem("customerID")}/totalCost`] = 0;
            updates[`Admins/${sessionStorage.getItem("adminID")}/customers/${sessionStorage.getItem("customerID")}/totalQty`] = 0;
            update(ref(db), updates).then(() => {
              console.log("Customer Data Created");
            }).catch((error) => {
              console.error(error);
              return false;
            });

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
