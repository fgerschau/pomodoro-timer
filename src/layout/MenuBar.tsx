import React, { FC } from 'react';
import { Toolbar, makeStyles, AppBar, Fab, Button } from '@material-ui/core';
import { PlayArrow, Stop, RotateLeft, Settings, Home } from '@material-ui/icons';
import { useTimerStore } from '../stores/useStores';
import { observer } from 'mobx-react';
import { initializeSound } from '../utils';
import { withRouter, RouteComponentProps } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  playButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
  },
  resetButton: {
    position: 'absolute',
    right: 0,
    marginRight: theme.spacing(2),
  },
}));

const MenuBar: FC<RouteComponentProps> = observer(({ history }) => {
  const classes = useStyles();
  const timer = useTimerStore();
  const toggleTimer = () => {
    initializeSound();
    if (timer.running) {
      timer.pauseTimer();
    } else {
      timer.startTimer();
    }
  };

  return (
    <AppBar position="fixed" color="primary" className={classes.appBar} data-test-id="app-wrapper">
      <Toolbar>
        {
          history.location.pathname.includes('settings') ?
            <Button
              data-test-id="menubar-home-link"
              onClick={() => history.push('/')}
            >
              <Home titleAccess="Home" />
            </Button>
          : <Button
            data-test-id="menubar-settings-link"
            onClick={() => history.push('/settings')}
          >
            <Settings titleAccess="Settings"/>
          </Button>
        }
        <Fab
          onClick={toggleTimer}
          color="secondary"
          className={classes.playButton}
          data-test-id="menubar-play-toggle"
        >
          {timer.running ?
            <Stop data-test-id="menubar-stop-icon" titleAccess="Stop the timer" /> :
            <PlayArrow data-test-id="menubar-play-icon" titleAccess="Play the timer" />
          }
        </Fab>
        <Button
          onClick={() => timer.resetTimer()}
          className={classes.resetButton}
          data-test-id="menubar-reset-button"
        >
          Reset &nbsp;
          <RotateLeft titleAccess="Reset timer"/>
        </Button>
      </Toolbar>
    </AppBar>
  );
});

export default withRouter(MenuBar);
