import React, { FC, useEffect } from 'react';
import { Typography, makeStyles, Button, Toolbar, Box, Slide } from '@material-ui/core';
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
    marginBottom: theme.spacing(8),
  },
  lockScreen: {
    marginTop: theme.spacing(2),
    margin: 'auto',
    maxWidth: '300px',
    padding: theme.spacing(1),
  },
  explanation: {
    marginTop: theme.spacing(5),
    fontWeight: 'bold',
    maxWidth: '500px',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: theme.spacing(3),
  },
  explanationDetails: {
    marginTop: theme.spacing(4),
  },
  strong: {
    fontWeight: 'bold',
    display: 'inline-block',
  },
}));

const Timer: FC = observer(() => {
  const classes = useStyles();
  const timer = useTimerStore();

  const [showExplanation, setShowExplanation] = React.useState(false);

  // istanbul ignore next
  useEffect(() => {
    setTimeout(() => {
      setShowExplanation(true);
    }, 800);
  }, []);

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
      <Slide in={showExplanation} mountOnEnter unmountOnExit direction="up">
        <div>
          <hr />
          <div className={classes.explanation}>
            <Typography variant="h4">The process</Typography>
            <Typography variant="body1" className={classes.explanationDetails}>
              <p>1. Decide on the <Typography className={classes.strong} color="primary">task to be done.</Typography></p>
              <p>2. Set the <Typography className={classes.strong} color="primary">pomodoro timer</Typography> (traditionally to 25 minutes). </p>
              <p>3. <Typography className={classes.strong} color="primary">Work</Typography> on the task. </p>
              <p>4. End work when the timer rings and <Typography className={classes.strong} color="primary">put a checkmark</Typography> on a piece of paper. </p>
              <p>5. If you have fewer than four checkmarks, <Typography className={classes.strong} color="primary">take a short break (3 – 5 minutes)</Typography>, then go to step 2. </p>
              <p>6. After four pomodoros, <Typography className={classes.strong} color="primary">take a longer break (15 – 30 minutes)</Typography>, reset your checkmark count to zero, then go to step 1. </p>
            </Typography>
            <a href="https://en.wikipedia.org/wiki/Pomodoro_Technique" rel="noopener noreferrer" target="_blank">See the Wikipedia article</a>
          </div>
        </div>
      </Slide>
    </div>
  );
});

export default Timer;
