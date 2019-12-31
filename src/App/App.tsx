import React from 'react';
import { ThemeProvider, CssBaseline } from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';

import MenuBar from '../layout/MenuBar';
import Routes from '../screens/Routes';
import theme from '../theme';
import TimerStore from '../stores/TimerStore';

const App: React.FC = () => {
  const stores = {
    timer: new TimerStore(),
  };

  return (
    <Provider data-test-id="app-mobx-provider" {...stores}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <div className="App">
            <MenuBar />
            <Routes />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
