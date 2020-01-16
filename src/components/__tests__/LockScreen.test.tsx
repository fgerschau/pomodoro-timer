import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import LockScreen from '../LockScreen';
import { getByTestId } from '../../../__helpers__/helper';

jest.mock('../../stores/useStores');
const { useConfigStore } = require('../../stores/useStores');

describe('LockScreen component', () => {
  const getLockOpen = (wrapper: ShallowWrapper) =>
    getByTestId(wrapper, 'lockscreen-lock-open');
  const getLockClosed = (wrapper: ShallowWrapper) =>
    getByTestId(wrapper, 'lockscreen-lock-closed');
  const getToggle = (wrapper: ShallowWrapper) =>
    getByTestId(wrapper, 'lockscreen-toggle');

  it('renders the component', () => {
    useConfigStore.mockImplementation(() => ({
      toggleLock: jest.fn(),
      locked: false,
    }));
    const wrapper = shallow(<LockScreen />);
    expect(getLockOpen(wrapper).exists()).toBe(true);
  });

  it('locks the screen', () => {
    const lockScreenMock = jest.fn();
    useConfigStore.mockImplementation(() => ({
      toggleLock: lockScreenMock,
      locked: false,
    }));

    // lock
    let wrapper = shallow(<LockScreen />);
    getToggle(wrapper).simulate('click');
    expect(lockScreenMock).toHaveBeenCalledTimes(1);
    lockScreenMock.mockReset();

    useConfigStore.mockImplementation(() => ({
      toggleLock: lockScreenMock,
      locked: true,
    }));
    wrapper = shallow(<LockScreen />);
    expect(getLockClosed(wrapper).exists()).toBe(true);

    // unlock
    getToggle(wrapper).simulate('click');
    expect(lockScreenMock).toHaveBeenCalledTimes(1);
  });
});
