import React, { FC } from 'react';
import {LockOpen, Lock} from '@material-ui/icons';
import {Button, Typography, Tooltip, useMediaQuery, useTheme} from '@material-ui/core';
import {useConfigStore} from '../stores/useStores';
import {observer} from 'mobx-react';

const NoSleep: any = require('nosleep.js');

const noSleep = new NoSleep();

const LockScreen: FC = observer(() => {
  const configStore = useConfigStore();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  const lockScreenInfo = "Click the lock to prevent the screen from turning off. The alarm will only sound if the display is turned on.";

  const toggleLock = () => {
    if (configStore.locked) {
      noSleep.enable();
    } else {
      noSleep.disable();
    }

    configStore.toggleLock();
  };

  return (
    <>
      <Tooltip title={lockScreenInfo}>
        <Button
          data-test-id="lockscreen-toggle"
          onClick={toggleLock}
        >
          {
            configStore.locked ?
              <>
                <Lock
                  data-test-id="lockscreen-lock-closed"
                />
                <br />
              </> :
              <>
                <LockOpen
                  data-test-id="lockscreen-lock-open"
                />
                <br />
              </>
            }
        </Button>
      </Tooltip>
      {
        configStore.locked ?
          <Typography variant="body1">The screen won't turn off.</Typography> :
          <Typography variant="body1">The screen will eventually turn off.</Typography>
      }
      <br />
      {
        matches ?
          <Typography
            variant="body2"
            color="secondary"
          >
            {lockScreenInfo}
          </Typography>
          : null
      }
    </>
  );
});

export default LockScreen;
