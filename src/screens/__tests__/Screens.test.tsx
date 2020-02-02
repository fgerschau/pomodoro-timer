import React from 'react';
import {shallow} from 'enzyme';
import Screens from '../Screens';

describe('Screens component', () => {
  it('renders the component', () => {
    const wrapper = shallow(<Screens />);
    expect(wrapper.find('Routes').exists()).toBe(true);
  });
});
