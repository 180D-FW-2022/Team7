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
          }, 2000); //check video stream for qr code every 2 seconds
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

      decode() {
        var canvas = document.createElement('canvas');
        var video = document.querySelector("video");

        canvas.width = 1920;
        canvas.height = 1080;

        var ctx = canvas.getContext('2d');
        ctx.drawImage( video, 0, 0, canvas.width, canvas.height );
        var image = canvas.toDataURL('image/jpeg');
        QrScanner.scanImage(image, {returnDetailedScanResult:true, scanRegion: {downScaledHeight:325, downScaledWidth:450}})
        .then(result => this.parseQRCode(result))
        .catch(err => console.log(err));
      }

      parseQRCode(text) {
        //parse user_id
	var url = "";
	try {
	    url = new URL(text['data']);
	} catch (_) {
	    console.log(text);
	    return false;
	}
        console.log(url.hostname);
        console.log(url.searchParams.get('user_id'));
        if ((url.hostname === "venmo.com") && (url.searchParams.get('user_id') !== "")) {
          //get customer info
          this.getCustomerInfo(url.searchParams.get('user_id'));
        }
	else if (text['data'] === "") {
	    console.log("No QR Code");
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

       goToSobrietyTestInstructions() { //only if had >3 drinks on tab (too easy to workaround tho) 
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
            this.setState({numberOfDrinks: data['totalQty']},() => {this.state.numberOfDrinks > 3 ? this.goToSobrietyTestInstructions() : this.goToMenu()});
          } else {
            console.log("No data available");
            this.setState({numberOfDrinks: 0});
            // fill in new customer data
            const updates = {};
            updates[`Admins/${sessionStorage.getItem("adminID")}/customers/${sessionStorage.getItem("customerID")}/totalCost`] = 0;
            updates[`Admins/${sessionStorage.getItem("adminID")}/customers/${sessionStorage.getItem("customerID")}/totalQty`] = 0;
            update(ref(db), updates).then(() => {
              console.log("Customer Data Created");
	      this.goToMenu();
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
                        Please show your Venmo QR Code (Screenshot + Zoom In)
                      </Typography>
                </Box>
                <Box display="flex" justifyContent="center" alignItems="center" height="calc(90vh - 64px)" bgcolor={theme.palette.secondary.main}>
                  <video/>
                </Box>
              </Box>
            </ThemeProvider>
          );
      }
}

export default QRCodeReader;
