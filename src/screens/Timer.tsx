import React, { FC } from 'react';
import { Typography, makeStyles, Button, Toolbar, Box } from '@material-ui/core';
import {observer} from 'mobx-react';
import { useTimerStore } from '../stores/useStores';

const useStyles = makeStyles(theme => ({
  wrapper: {
    marginTop: theme.spacing(7),
    textAlign: 'center',
  },
  header: {
    fontWeight: 'bold',
  },
  timer: {
    marginTop: theme.spacing(2),
    fontWeight: 'bold',
  },
  secondButton: {
    marginLeft: theme.spacing(2),
  },
  toolbar: {
    marginTop: theme.spacing(2),
  },
  lockScreen: {
    marginTop: theme.spacing(2),
    margin: 'auto',
    maxWidth: '300px',
    padding: theme.spacing(1),
  },
}));

const Timer: FC = observer(() => {
  const classes = useStyles();
  const timer = useTimerStore();

  return (
    <div className={classes.wrapper}>
      <Typography variant="h4" className={classes.header}>
        Pomodoro Timer
      </Typography>
      <Typography variant="h1" className={classes.timer} data-test-id="timer-timeleft">
        {timer.timeLeftFormatted}
      </Typography>

      <Box justifyContent="center" display="flex" className={classes.toolbar}>
        <Toolbar variant="dense">
          <Button
            color="primary"
            variant="contained"
            data-test-id="timer-set-pomodoro"
            onClick={() => timer.resetTimer('pomodoro')}
          >
            Pomodoro
          </Button>
          <Button
            color="primary"
            variant="contained"
            className={classes.secondButton}
            data-test-id="timer-set-break"
            onClick={() => timer.resetTimer('break')}
          >
            Break
          </Button>
        </Toolbar>
      </Box>
    </div>
  );
});

export default Timer;
