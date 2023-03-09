import React, { Component } from 'react';
import { createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@emotion/react';
import Circle from '@mui/icons-material/Circle';
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
    },
    gray: {
      main: '#808080',
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

const detectTap = () => {
  const url = `http://localhost:9999/tapDetection/`;
  return fetch(url)
  .then(response => response.json())
  .then(json => {
      console.log('parsed json', json) // access json.body here
      if(json['result'] === 'tap') {
          console.log("TAP DETECTED");
          return true;
      }
      else if (json['result'] === 'IMU not detected') {
        console.log("ERROR: IMU NOT DETECTED");
        return false;
      }
      else {
          console.log("TAP NOT DETECTED");
          return false;
      }
  })
}

class SobrietyTest extends Component {

  constructor(props) {
    super(props);
    this.state = {
        simonSays: false,
        attempts: 0,
        completedTest: false,
        testPassed: false,
        circleColor1: theme.palette.gray.main,
        circleColor2: theme.palette.gray.main,
        circleColor3: theme.palette.gray.main,
        circleColor4: theme.palette.gray.main,
        circleColor5: theme.palette.gray.main,
    }
  }

  componentDidMount() {
    const timeoutMs = 300000;
    const timeout = setTimeout(() => {
        this.exit();
        }, timeoutMs); //render for 5 minutes and then push to start

    const delayMs = 5000;
    const delay = setTimeout(() => {
      this.runSobrietyTest()
      }, delayMs); //delay sequence for 5 seconds
      sessionStorage.setItem("timeoutID", timeout.toString());
        return () => {clearTimeout(timeout); clearTimeout(delay)};
    }

   exit() {
    // clear data
    clearTimeout(parseInt(sessionStorage.getItem("timeoutID")));
    sessionStorage.clear();
    window.location.href = "/"; //goes back to start
   }

   pickRandomInstruction() {
    const possibleInstructions = ['tap','noTap'];
    return possibleInstructions[Math.floor(Math.random()*possibleInstructions.length)];
   }

   iterateThroughAPattern() {
    var score = 0;

    var instruction = this.pickRandomInstruction();
    var simonSaysBool = Math.random() < 0.5;
    var instructionColor = theme.palette.gray.main;
    if (instruction === 'tap') { //tap
      instructionColor = theme.palette.cash.main;
    }
    else { //no tap
      instructionColor = theme.palette.info.main;
    }
    this.setState({circleColor1: instructionColor, circleColor2: theme.palette.gray.main, circleColor3: theme.palette.gray.main, circleColor4: theme.palette.gray.main, circleColor5: theme.palette.gray.main, simonSays: simonSaysBool});
    detectTap().then((tapped) => { //Detect 1st tap
      if(((simonSaysBool) && (instruction === 'tap') && (tapped)) || ((!simonSaysBool) && (instruction === 'tap') && (!tapped)) || ((simonSaysBool) && (instruction !== 'tap') && (!tapped)) || ((!simonSaysBool) && (instruction !== 'tap') && (tapped))) {
        score++;
      }
      instruction = this.pickRandomInstruction();
      simonSaysBool = Math.random() < 0.5;
      instructionColor = theme.palette.gray.main;
      if (instruction === 'tap') { //tap
        instructionColor = theme.palette.cash.main;
      }
      else { //no tap
        instructionColor = theme.palette.info.main;
      }
      this.setState({circleColor1: theme.palette.gray.main, circleColor2: instructionColor, circleColor3: theme.palette.gray.main, circleColor4: theme.palette.gray.main, circleColor5: theme.palette.gray.main, simonSays: simonSaysBool});
      detectTap().then((tapped) => { //Detect 2nd tap
        if(((simonSaysBool) && (instruction === 'tap') && (tapped)) || ((!simonSaysBool) && (instruction === 'tap') && (!tapped)) || ((simonSaysBool) && (instruction !== 'tap') && (!tapped)) || ((!simonSaysBool) && (instruction !== 'tap') && (tapped))) {
          score++;
        }
        instruction = this.pickRandomInstruction();
        simonSaysBool = Math.random() < 0.5;
        instructionColor = theme.palette.gray.main;
        if (instruction === 'tap') { //tap
          instructionColor = theme.palette.cash.main;
        }
        else { //no tap
          instructionColor = theme.palette.info.main;
        }
        this.setState({circleColor1: theme.palette.gray.main, circleColor2: theme.palette.gray.main, circleColor3: instructionColor, circleColor4: theme.palette.gray.main, circleColor5: theme.palette.gray.main, simonSays: simonSaysBool});
        detectTap().then((tapped) => { //Detect 3rd tap
          if(((simonSaysBool) && (instruction === 'tap') && (tapped)) || ((!simonSaysBool) && (instruction === 'tap') && (!tapped)) || ((simonSaysBool) && (instruction !== 'tap') && (!tapped)) || ((!simonSaysBool) && (instruction !== 'tap') && (tapped))) {
            score++;
          }
          instruction = this.pickRandomInstruction();
          simonSaysBool = Math.random() < 0.5;
          instructionColor = theme.palette.gray.main;
          if (instruction === 'tap') { //tap
            instructionColor = theme.palette.cash.main;
          }
          else { //no tap
            instructionColor = theme.palette.info.main;
          }
          this.setState({circleColor1: theme.palette.gray.main, circleColor2: theme.palette.gray.main, circleColor3: theme.palette.gray.main, circleColor4: instructionColor, circleColor5: theme.palette.gray.main, simonSays: simonSaysBool});
          detectTap().then((tapped) => { //Detect 4th tap
            if(((simonSaysBool) && (instruction === 'tap') && (tapped)) || ((!simonSaysBool) && (instruction === 'tap') && (!tapped)) || ((simonSaysBool) && (instruction !== 'tap') && (!tapped)) || ((!simonSaysBool) && (instruction !== 'tap') && (tapped))) {
              score++;
            }
            instruction = this.pickRandomInstruction();
            simonSaysBool = Math.random() < 0.5;
            instructionColor = theme.palette.gray.main;
            if (instruction === 'tap') { //tap
              instructionColor = theme.palette.cash.main;
            }
            else { //no tap
              instructionColor = theme.palette.info.main;
            }
            this.setState({circleColor1: theme.palette.gray.main, circleColor2: theme.palette.gray.main, circleColor3: theme.palette.gray.main, circleColor4: theme.palette.gray.main, circleColor5: instructionColor, simonSays: simonSaysBool});
            detectTap().then((tapped) => { //Detect 5th tap
              if(((simonSaysBool) && (instruction === 'tap') && (tapped)) || ((!simonSaysBool) && (instruction === 'tap') && (!tapped)) || ((simonSaysBool) && (instruction !== 'tap') && (!tapped)) || ((!simonSaysBool) && (instruction !== 'tap') && (tapped))) {
                score++;
              }
              this.setState({circleColor1: theme.palette.gray.main, circleColor2: theme.palette.gray.main, circleColor3: theme.palette.gray.main, circleColor4: theme.palette.gray.main, circleColor5: theme.palette.gray.main, completedTest: true, attempts: this.state.attempts+1});
              if (score === 5) {
                this.testPassed();
                return true;
              }
              else { // did not pass test
                this.testFailed();
                return true;
              }
            })
          })
        })
      })
    })
    return false;
   }

   runSobrietyTest() {
    this.setState(({completedTest: false, testPassed: false}), () => this.iterateThroughAPattern());
    }

    testPassed() {
      this.setState({testPassed: true});
      this.moveToMenu();
    }

    testFailed() {
      this.setState({testPassed: false}, () => {
        if (this.state.attempts >= 2) {
          this.exit();
        }
      });
    }

    tryAgain() {
      this.runSobrietyTest();
    }

    moveToMenu() {
      clearTimeout(parseInt(sessionStorage.getItem("timeoutID")));
      const timeoutMs = 3000;
      const timeout = setTimeout(() => {
        window.location.href = '/menu';
      }, timeoutMs);

      return () => clearTimeout(timeout);
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
            <Box display="block" justifyContent="center" alignItems="center" height="calc(30vh - 64px)" bgcolor={theme.palette.secondary.main}>
                <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    sx={{
                    display: { xs: 'none', md: 'block', paddingTop: '30px' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    }}
                >
                    Follow the Following Pattern Below by Tapping the IMU
                </Typography>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Typography
                      variant="h6"
                      noWrap
                      component="a"
                      sx={{
                      display: { xs: 'none', md: 'flex'},
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: theme.palette.cash.main,
                      textDecoration: 'none',
                      }}
                  >
                      GREEN
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
                      &nbsp;= Tap
                  </Typography>
                  <Typography
                      variant="h6"
                      noWrap
                      component="a"
                      sx={{
                      display: { xs: 'none', md: 'flex'},
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: theme.palette.info.main,
                      textDecoration: 'none',
                      }}
                  >
                      &nbsp;&nbsp;RED
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
                      &nbsp;= Do Not Tap
                  </Typography>
                </Box>
            </Box>
            {!this.state.completedTest &&
              <Box display="flex" justifyContent="center" alignItems="center" height="10vh" bgcolor={theme.palette.secondary.main}>
              {this.state.simonSays && 
                <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    sx={{
                    display: { xs: 'none', md: 'block', paddingTop: '30px' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    }}
                >
                    Simon Says&nbsp;
                </Typography>
              }
              <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    sx={{
                    display: { xs: 'none', md: 'block', paddingTop: '30px' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    }}
                >
                    Follow the Pattern
                </Typography>
            </Box>
            }
            {this.state.completedTest && this.state.testPassed &&
              <Box display="flex" justifyContent="center" alignItems="center" height="10vh" bgcolor={theme.palette.secondary.main}>
              <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    sx={{
                    display: { xs: 'none', md: 'block', paddingTop: '30px' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    }}
                >
                    You Passed!
                </Typography>
            </Box>
            }
            {this.state.completedTest && !this.state.testPassed &&
              <Box display="flex" justifyContent="center" alignItems="center" height="10vh" bgcolor={theme.palette.secondary.main}>
              <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    sx={{
                    display: { xs: 'none', md: 'block', paddingTop: '30px' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    }}
                >
                    You Did Not Pass...
                </Typography>
            </Box>
            }
            <Box display="flex" justifyContent="space-evenly" alignItems="center" height="40vh" bgcolor={theme.palette.secondary.main}>
                <Circle sx={{fontSize: 100, color: this.state.circleColor1}}/>
                <Circle sx={{fontSize: 100, color: this.state.circleColor2}}/>
                <Circle sx={{fontSize: 100, color: this.state.circleColor3}}/>
                <Circle sx={{fontSize: 100, color: this.state.circleColor4}}/>
                <Circle sx={{fontSize: 100, color: this.state.circleColor5}}/>
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center" height="20vh" bgcolor={theme.palette.secondary.main}>
                { (this.state.attempts < 2) && (this.state.completedTest) && (!this.state.testPassed) &&
                  <Button variant="contained" onClick={() => this.tryAgain()}>
                    Try Again
                  </Button>
                }
            </Box>
        </Box>
        </ThemeProvider>
    );
 }
}

export default SobrietyTest;
