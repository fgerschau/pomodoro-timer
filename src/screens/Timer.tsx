import React, { FC } from 'react';
import { Typography, makeStyles } from '@material-ui/core';
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
    </div>
  );
});

export default Timer;
