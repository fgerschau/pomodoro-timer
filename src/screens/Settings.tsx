import React, { FC, ChangeEvent, FormEvent } from 'react';
import {Typography, makeStyles, TextField, Button, Snackbar, Grid} from '@material-ui/core';
import {useTimerStore} from '../stores/useStores';
import {observer} from 'mobx-react';

const useStyles = makeStyles(theme => ({
  wrapper: {
    marginTop: theme.spacing(7),
    margin: 'auto',
  },
  header: {
    marginBottom: theme.spacing(2),
  },
  inputContainer: {
    flexGrow: 1,
    maxWidth: '700px',
  },
  input: {
    width: '100%',
  },
  footer: {
    marginTop: theme.spacing(3),
  },
}));

interface ISettingsForm {
  pomodoroLength: number;
  breakLength: number;
  longBreakLength: number;
}

const Settings: FC = observer(() => {
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [pomodoroError, setPomodoroError] = React.useState<string>('');
  const [breakError, setBreakError] = React.useState<string>('');
  const [longBreakError, setLongBreakError] = React.useState<string>('');

  const classes = useStyles();
  const timer = useTimerStore();

  const [form, setForm] = React.useState<ISettingsForm>({
    pomodoroLength: timer.pomodoroLength / (60 * 1000),
    breakLength: timer.breakLength / (60 * 1000),
    longBreakLength: timer.longBreakLength / (60 * 1000),
  });

  const validateNumberInput = (value: string) =>
    !value || !isNaN(parseInt(value, 10));

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const field: string = e.target?.name;
    const value: string = e.target?.value;
    if (!validateNumberInput(value)) {
      if (field === 'pomodoroLength') {
        setPomodoroError('Invalid value');
      }

      if (field === 'breakLength') {
        setBreakError('Invalid value');
        setLongBreakError('Invalid value');
      }

      return;
    } else {
      setPomodoroError('');
      setBreakError('');
      setLongBreakError('');
    }

    const _form: any = { ...form };
    _form[field] = !isNaN(parseInt(value, 10)) ? parseInt(value, 10) : '';
    setForm(_form);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const pomodoroValueCorrect = form.pomodoroLength > 0;
    const breakValueCorrect = form.breakLength > 0;
    const longBreakValueCorrect = form.longBreakLength > 0;
    setPomodoroError(pomodoroValueCorrect ? '' : 'Value has to be > 0');
    setBreakError(breakValueCorrect ? '' : 'Value has to be > 0');
    setLongBreakError(longBreakValueCorrect ? '' : 'Value has to be > 0');

    if (pomodoroValueCorrect && breakValueCorrect && longBreakValueCorrect) {
      timer.setPomodoroLength(form.pomodoroLength * 60 * 1000);
      timer.setBreakLength(form.breakLength * 60 * 1000);
      timer.setLongBreakLength(form.longBreakLength * 60 * 1000);
      timer.resetTimer();
      setShowSuccess(true);
    }
  };

  return (
    <div className={classes.wrapper} data-test-id="settings-wrapper">
      <Typography variant="h4" className={classes.header}>
        Settings
      </Typography>
      <form
        autoComplete="off"
        onSubmit={handleFormSubmit}
        data-test-id="settings-form"
      >
        <Grid className={classes.inputContainer} container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              className={classes.input}
              margin="normal"
              data-test-id="settings-pomodoro-length"
              label="Pomodoro"
              type="number"
              value={form.pomodoroLength}
              name="pomodoroLength"
              onChange={handleInputChange}
              variant="outlined"
              helperText={pomodoroError}
              error={!!pomodoroError}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              className={classes.input}
              margin="normal"
              data-test-id="settings-break-length"
              name="breakLength"
              onChange={handleInputChange}
              label="Short break"
              type="number"
              value={form.breakLength}
              variant="outlined"
              helperText={breakError}
              error={!!breakError}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              className={classes.input}
              margin="normal"
              data-test-id="settings-long-break-length"
              name="longBreakLength"
              onChange={handleInputChange}
              label="Long break"
              type="number"
              value={form.longBreakLength}
              variant="outlined"
              helperText={longBreakError}
              error={!!longBreakError}
              required
            />
          </Grid>
        </Grid>
        <br />
        <Button
          color="primary"
          variant="contained"
          type="submit"
        >
          Submit
        </Button>
      </form>
      <div className={classes.footer}>
        <Typography
          variant="body2"
        >
          Version: {process.env.REACT_APP_VERSION}
        </Typography>
        <Typography variant="body2">
          by <a href="https://github.com/fgerschau" target="_blank" rel="noopener noreferrer">Felix Gerschau</a> © 2020
        </Typography>
      </div>
      <Snackbar
        open={showSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        message="Saved!"
        data-test-id="settings-success-message"
      />
    </div>
  );
});

export default Settings;
