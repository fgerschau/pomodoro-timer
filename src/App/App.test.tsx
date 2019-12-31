import React from 'react';
import App from './App';
import { shallow } from 'enzyme';
import {getByTestId} from '../../__helpers__/helper';

describe('App component', () => {
  it('renders the app component with mobx stores', () => {
    const wrapper = shallow(<App />);
    expect(getByTestId(wrapper, 'app-mobx-provider').props()).toHaveProperty('timer');
  });
});
