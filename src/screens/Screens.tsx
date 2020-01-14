import React, { FC, useEffect } from 'react';
import {Snackbar, Button, CircularProgress} from '@material-ui/core';
import Routes from './Routes';
import { timeout } from '../utils';

const Screens: FC = () => {
  const [reloading, setReloading] = React.useState(false);
  const [showReload, setShowReload] = React.useState(false);

  // istanbul ignore next
  useEffect(() => {
    // istanbul ignore next
    timeout(3000).then(() => {
      (window as any).isUpdateAvailable?.then((isAvailable: boolean) => {
        if (!isAvailable) return;
        setShowReload(true);
      });
    });
  }, []);

  const reloadPage = () => {
    setReloading(true);
    (window as any).currentSW?.postMessage({ type: 'SKIP_WAITING' });
    setShowReload(false);

    // istanbul ignore next - can't be implemented due to JSDOM
    if (process.env.NODE_ENV !== 'test') {
      window.location.reload(true);
    }
  };

  // istanbul ignore next
  return (
    <>
      <Snackbar
        open={showReload}
        message="A new version is available!"
        onClick={reloadPage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        data-test-id="screens-new-version-snackbar"
        action={
          <Button
            color="inherit"
            size="small"
            onClick={reloadPage}
          >
            {reloading ? <CircularProgress data-test-id="screens-loading-icon" /> : 'Reload'}
          </Button>
        }
      />
      <Routes />
    </>
  );
}

export default Screens;
