import React, { FC, ChangeEvent, FormEvent } from 'react';
import {Typography, makeStyles, TextField, Button} from '@material-ui/core';
import {useTimerStore} from '../stores/useStores';
import {observer} from 'mobx-react';

const useStyles = makeStyles(theme => ({
  wrapper: {
    marginTop: theme.spacing(7),
  },
  header: {
    marginBottom: theme.spacing(2),
  },
  firstInput: {
    marginRight: theme.spacing(1),
  }
}))

interface ISettingsForm {
  pomodoroLength: number;
  breakLength: number;
}

const Settings: FC = observer(() => {
  const [pomodoroError, setPomodoroError] = React.useState<string>('');
  const [breakError, setBreakError] = React.useState<string>('');

  const classes = useStyles();
  const timer = useTimerStore();

  const [form, setForm] = React.useState<ISettingsForm>({
    pomodoroLength: timer.pomodoroLength / (60 * 1000),
    breakLength: timer.breakLength / (60 * 1000),
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
      }

      return;
    } else {
      setPomodoroError('');
      setBreakError('');
    }

    const _form: any = { ...form };
    _form[field] = !isNaN(parseInt(value, 10)) ? parseInt(value, 10) : '';
    setForm(_form);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const pomodoroValueCorrect = form.pomodoroLength > 0;
    const breakValueCorrect = form.breakLength > 0;
    setPomodoroError(pomodoroValueCorrect ? '' : 'Value has to be > 0');
    setBreakError(breakValueCorrect ? '' : 'Value has to be > 0');

    if (pomodoroValueCorrect && breakValueCorrect) {
      timer.setPomodoroLength(form.pomodoroLength * 60 * 1000);
      timer.setBreakLength(form.breakLength * 60 * 1000);
      timer.resetTimer();
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
        <TextField
          className={classes.firstInput}
          margin="normal"
          data-test-id="settings-pomodoro-length"
          label="Pomodoro time"
          type="number"
          value={form.pomodoroLength}
          name="pomodoroLength"
          onChange={handleInputChange}
          variant="outlined"
          helperText={pomodoroError}
          error={!!pomodoroError}
          required
        />
        <TextField
          margin="normal"
          data-test-id="settings-break-length"
          name="breakLength"
          onChange={handleInputChange}
          label="Break time"
          type="number"
          value={form.breakLength}
          variant="outlined"
          helperText={breakError}
          error={!!breakError}
          required
        />
        <br />
        <Button
          color="primary"
          variant="contained"
          type="submit"
        >
          Submit
        </Button>
      </form>
    </div>
  );
});

export default Settings;
