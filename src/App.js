import React, { Fragment } from 'react';
import Diffusion from './Pages/Diffusion';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import BroCharts from './BroCharts';
import { makeStyles, Typography } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
});

const useStyles = makeStyles(() => ({
  plot: {
    marginLeft: 64,
    marginRight: 64,
  },
}));

const App = () => {
  const classes = useStyles();

  return (
    <Fragment>
      <ThemeProvider theme={theme}>
        <Diffusion />
        <div className={classes.plot}>
          <BroCharts />
        </div>
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
      </ThemeProvider>
    </Fragment>
  );
};

export default App;
