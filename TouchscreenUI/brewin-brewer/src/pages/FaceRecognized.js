import React, {Component} from 'react';
import { createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@emotion/react';
import { db } from '../utils/firebase';
import { get, query, ref } from "firebase/database";
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
  },
});

class FaceRecognized extends Component {

  constructor(props) {
    super(props);
    this.state = {
        name: "Fabrizio",
        totalDrinksServed: 0,
        legal: false,
    }
  }

  componentDidMount() {
    const MAX_TESTLESS_DRINKS = 3;
    this.retrieveCustomerDrinkData("fabcas01", "fabcas01");
    const timeout = setTimeout(() => {
      if (!this.state.legal) {
        window.location.replace('/invalidid');
      }
      else if (this.state.totalDrinksServed > MAX_TESTLESS_DRINKS) {
        window.location.replace('/sobrietytestinstructions');
      }
      else {
        window.location.replace('/menu');
      }
      
      }, 5000); //render for 5 seconds and then push to next page

      return () => clearTimeout(timeout);
  }

  exit() {
    // add function to clear data here

    window.location.replace('/'); //goes back to start
   }

  retrieveCustomerDrinkData(adminID, customerID) { 
    var data = null;
    get(query(ref(db, `Admins/${adminID}/customers/${customerID}`))).then((snapshot) => {
      if (snapshot.exists()) {
        data = snapshot.val();
        const currentTab = Object.values(data['tab']);        
        var totalDrinks = 0;
        currentTab.forEach(item => totalDrinks += item['qty'])
        this.setState({totalDrinksServed: totalDrinks, legal: data['legal']});
        console.log(data);
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
          <Box display="flex" justifyContent="center" alignItems="center" height="80vh" bgcolor={theme.palette.secondary.main}>
              <Typography
                  variant="h2"
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
                  Welcome back, {this.state.name}!
                </Typography>
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

export default FaceRecognized;
