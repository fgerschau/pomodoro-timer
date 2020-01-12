import React from 'react';
import { ThemeProvider, CssBaseline  } from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';

import MenuBar from '../layout/MenuBar';
import theme from '../theme';
import TimerStore from '../stores/TimerStore';
import Screens from '../screens/Screens';

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
            <Screens />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
