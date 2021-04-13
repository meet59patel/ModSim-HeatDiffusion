import React, { Fragment } from 'react';
import Diffusion from './Pages/Diffusion';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import BroCharts from './BroCharts';
import { makeStyles, Typography, Card } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
});

const useStyles = makeStyles(() => ({
  plot: {
    marginLeft: 32,
    marginRight: 32,
  },

  paper: {
    margin: 24,
    padding: 12,
  },
}));

const App = () => {
  const classes = useStyles();

  return (
    <Fragment>
      <ThemeProvider theme={theme}>
        <Card className={classes.paper} elevation={5}>
          <Typography align="center" variant="h4">
            Heat Diffusion Simulation
          </Typography>
        </Card>
        <Diffusion />
        <div className={classes.plot}>
          <BroCharts />
        </div>
        <Card className={classes.paper} elevation={5}>
          <Typography variant="h5" align="center">
            Developed By{' '}
            <a
              href="https://github.com/meet59patel"
              target="_blank"
              rel="noreferrer"
            >
              Meet Patel
            </a>{' '}
            and{' '}
            <a
              href="https://github.com/HemangNakarani"
              target="_blank"
              rel="noreferrer"
            >
              Hemang Nakarani
            </a>
          </Typography>
        </Card>
      </ThemeProvider>
    </Fragment>
  );
};

export default App;
