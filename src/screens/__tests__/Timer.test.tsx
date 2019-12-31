import React from 'react';
import Timer from '../Timer';
import { getByTestId } from '../../../__helpers__/helper';
import { shallow } from 'enzyme';

jest.mock('../../stores/useStores');

const produceComponent = () => {
  return shallow(
    <Timer />
  );
};

describe('Timer component', () => {
  it('renders the component', () => {
    const wrapper = produceComponent();
    expect(getByTestId(wrapper, 'timer-timeleft').text()).toBe('0:00');
  });
});
