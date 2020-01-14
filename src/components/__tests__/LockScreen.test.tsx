import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import LockScreen from '../LockScreen';
import { getByTestId } from '../../../__helpers__/helper';

describe('LockScreen component', () => {
  const getLockOpen = (wrapper: ShallowWrapper) =>
    getByTestId(wrapper, 'lockscreen-lock-open');
  const getLockClosed = (wrapper: ShallowWrapper) =>
    getByTestId(wrapper, 'lockscreen-lock-closed');
  const getToggle = (wrapper: ShallowWrapper) =>
    getByTestId(wrapper, 'lockscreen-toggle');

  it('renders the component', () => {
    const wrapper = shallow(<LockScreen />);
    expect(getLockOpen(wrapper).exists()).toBe(true);
  });

  it('locks the screen', () => {
    const setStateMock = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockImplementation(() => [false, setStateMock]);

    // lock
    let wrapper = shallow(<LockScreen />);
    getToggle(wrapper).simulate('click');
    expect(setStateMock).toHaveBeenCalledWith(true);
    setStateMock.mockReset();

    useStateSpy.mockImplementation(() => [true, setStateMock]);
    wrapper = shallow(<LockScreen />);
    expect(getLockClosed(wrapper).exists()).toBe(true);

    // unlock
    getToggle(wrapper).simulate('click');
    expect(setStateMock).toHaveBeenCalledWith(false);
  });
});
