import React, { FC, useEffect } from 'react';
import {Snackbar, Button, CircularProgress} from '@material-ui/core';
import Routes from './Routes';
import { timeout } from '../utils';

const Screens: FC = () => {
  const [reloading, setReloading] = React.useState(false);
  const [showReload, setShowReload] = React.useState(false);

  useEffect(() => {
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
    window.location.reload(true);
    setShowReload(false);
  };

  return (
    <>
      <Snackbar
        open={showReload}
        message="A new version is available!"
        onClick={reloadPage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={reloadPage}
          >
            {reloading ? <CircularProgress /> : 'Reload'}
          </Button>
        }
      />
      <Routes />
    </>
  );
}

export default Screens;
