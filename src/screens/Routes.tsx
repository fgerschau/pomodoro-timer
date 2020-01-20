// istanbul ignore file
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Timer from './Timer';
import Settings from './Settings';
import { Container } from '@material-ui/core';

const Routes = () => (
  <Container style={{ paddingBottom: '100px' }}>
    <Switch>
      <Route path="/settings" component={Settings} />
      <Route path="/" component={Timer} />
    </Switch>
  </Container>
);

export default Routes;
