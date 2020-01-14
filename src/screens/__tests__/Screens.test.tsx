import React from 'react';
import {shallow, ShallowWrapper} from 'enzyme';
import Screens from '../Screens';
import {getByTestId} from '../../../__helpers__/helper';
import {SnackbarProps} from '@material-ui/core';

describe('Screens component', () => {
  const getSnackbar = (wrapper: ShallowWrapper): ShallowWrapper<SnackbarProps> =>
    getByTestId(wrapper, 'screens-new-version-snackbar');

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders the component', () => {
    const wrapper = shallow(<Screens />);
    expect(getSnackbar(wrapper).exists()).toBe(true);
    expect(wrapper.find('Routes').exists()).toBe(true);
  });

  it('should reload the page', () => {
    const setStateMock = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockImplementation(() => [false, setStateMock]);
    const swPostMessageMock = jest.fn();
    (window as any).currentSW = { postMessage: swPostMessageMock };

    const wrapper = shallow(<Screens />);
    getSnackbar(wrapper).simulate('click');

    // Skips sw waiting
    expect(swPostMessageMock).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });
    expect(swPostMessageMock).toHaveBeenCalledTimes(1);
    // Shows snackbar
    expect(setStateMock).toHaveBeenCalledTimes(2);
    expect(setStateMock).toHaveBeenNthCalledWith(1, true);
    expect(setStateMock).toHaveBeenNthCalledWith(2, false);
  });
});
