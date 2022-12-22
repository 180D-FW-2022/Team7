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
});

var instructionInterval = null;

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

        return () => {clearTimeout(timeout); clearTimeout(delay)};
    }

   exit() {
    // add function to clear data here

    window.location.replace('/'); //goes back to start
   }

   pickRandomInstruction() {
    const possibleInstructions = ['tap','noTap'];
    return possibleInstructions[Math.floor(Math.random()*possibleInstructions.length)];
   }

   iterateThroughAPattern() {
    const delayMs = 3000;
    var i = 0;
    if (!instructionInterval) {
      instructionInterval = setInterval(() => {
        if (i < 6) {
          const instruction = this.pickRandomInstruction();
          const simonSaysBool = Math.random() < 0.5;
          var instructionColor = theme.palette.gray.main;
          if (instruction === 'tap') { //tap
            instructionColor = theme.palette.cash.main;
          }
          else { //no tap
            instructionColor = theme.palette.info.main;
          }
          //console.log(i);
          switch(i) {
            case 0:
              this.setState({circleColor1: instructionColor, circleColor2: theme.palette.gray.main, circleColor3: theme.palette.gray.main, circleColor4: theme.palette.gray.main, circleColor5: theme.palette.gray.main, simonSays: simonSaysBool});
              i++;
              break;
            case 1:
              this.setState({circleColor1: theme.palette.gray.main, circleColor2: instructionColor, circleColor3: theme.palette.gray.main, circleColor4: theme.palette.gray.main, circleColor5: theme.palette.gray.main, simonSays: simonSaysBool});
              i++;
              break;
            case 2:
              this.setState({circleColor1: theme.palette.gray.main, circleColor2: theme.palette.gray.main, circleColor3: instructionColor, circleColor4: theme.palette.gray.main, circleColor5: theme.palette.gray.main, simonSays: simonSaysBool});
              i++;
              break;
            case 3:
              this.setState({circleColor1: theme.palette.gray.main, circleColor2: theme.palette.gray.main, circleColor3: theme.palette.gray.main, circleColor4: instructionColor, circleColor5: theme.palette.gray.main, simonSays: simonSaysBool});
              i++;
              break;
            case 4:
              this.setState({circleColor1: theme.palette.gray.main, circleColor2: theme.palette.gray.main, circleColor3: theme.palette.gray.main, circleColor4: theme.palette.gray.main, circleColor5: instructionColor, simonSays: simonSaysBool});
              i++;
              break;
            default:
              this.setState({circleColor1: theme.palette.gray.main, circleColor2: theme.palette.gray.main, circleColor3: theme.palette.gray.main, circleColor4: theme.palette.gray.main, circleColor5: theme.palette.gray.main, completedTest: true, attempts: this.state.attempts+1}, () => console.log(this.state.attempts));
              clearInterval(instructionInterval);
              instructionInterval = null;
              break;
          }
        }
      }, delayMs);
    }
   }

   runSobrietyTest() {
    this.setState({completedTest: false, testPassed: false}, this.iterateThroughAPattern());
    }

    testPassed() {
      this.setState({testPassed: true}, this.moveToNextPage("/menu"));
    }

    testFailed() {
      this.setState({testPassed: false}, () => {
        if (this.state.attempts >= 2) {
        this.moveToNextPage("/");
      }});
    }

    tryAgain() {
      this.runSobrietyTest();
    }

    moveToNextPage(url) {
      const timeoutMs = 3000;
      setTimeout(() => {
        window.location.replace(url);
      }, timeoutMs);
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
            <Box display="block" justifyContent="center" alignItems="center" height="20vh" bgcolor={theme.palette.secondary.main}>
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
                    Follow the Following Pattern Below by Tapping the IMU Below
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
            <Box display="flex" justifyContent="center" alignItems="center" height="10vh" bgcolor={theme.palette.secondary.main}>
                { (this.state.attempts < 2) && (this.state.completedTest) && (!this.state.testPassed) &&
                  <Button variant="contained" onClick={() => this.tryAgain()}>
                    Try Again
                  </Button>
                }
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center" height="10vh">
            <Button variant="contained" href="/">
                Back to Start
            </Button>
            <Button variant="contained" onClick={() => this.testPassed()}>
                Test Passed
            </Button>
            <Button variant="contained" onClick={() => this.testFailed()}>
                Test Not Passed
            </Button>
            </Box>
        </Box>
        </ThemeProvider>
    );
 }
}

export default SobrietyTest;
