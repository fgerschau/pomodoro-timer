// istanbul ignore file
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Timer from './Timer';
import { Container } from '@material-ui/core';

const Routes = () => (
  <Container>
    <Switch>
      <Route path='/' component={Timer} />
    </Switch>
  </Container>
);

export default Routes;
