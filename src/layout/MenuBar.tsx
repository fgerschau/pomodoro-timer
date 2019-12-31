import React, { FC } from 'react';
import { Toolbar, makeStyles, AppBar, Fab, Button } from '@material-ui/core';
import { PlayArrow, Stop, RotateLeft } from '@material-ui/icons';
import { useTimerStore } from '../stores/useStores';
import { observer } from 'mobx-react';

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

const MenuBar: FC = observer(() => {
  const classes = useStyles();
  const timer = useTimerStore();
  const toggleTimer = () => {
    if (timer.running) {
      timer.pauseTimer();
    } else {
      timer.startTimer();
    }
  };

  return (
    <AppBar position="fixed" color="primary" className={classes.appBar} data-test-id="app-wrapper">
      <Toolbar>
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
          color="secondary"
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

export default MenuBar;
