import React from 'react';
import {getByTestId} from '../../../__helpers__/helper';
import {ShallowWrapper, shallow} from 'enzyme';
import {SnackbarProps} from '@material-ui/core';
jest.mock('../../serviceWorker');
import ServiceWorkerWrapper from '../ServiceWorkerWrapper';

describe('ServiceWorkerWrapper component', () => {
  const postMessageMock = jest.fn();
  const swMock = {
    postMessage: postMessageMock,
  } as any;
  const setShowReloadMock = jest.fn();
  const setInstallingWorkerMock = jest.fn();
  const { register } = require('../../serviceWorker');

  const getSnackbar = (wrapper: ShallowWrapper): ShallowWrapper<SnackbarProps> =>
    getByTestId(wrapper, 'screens-new-version-snackbar');

  beforeAll(() => {
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockImplementation(((initialValue: any) => {
      if (initialValue === false) { // show reload state
        return [false, setShowReloadMock];
      }

      // installing worker state
      return [swMock, setInstallingWorkerMock];
    }) as any);

    register.mockImplementation(jest.fn(({
      onUpdate
    }: {
      onUpdate: (sw: ServiceWorkerRegistration) => void,
    }) => {
      onUpdate(swMock);
    }));

    window.location.reload = jest.fn();
  });

  beforeEach(() => {
    postMessageMock.mockClear();
    setShowReloadMock.mockClear();
    setInstallingWorkerMock.mockClear();
    register.mockClear();
  });

  it('renders the page', () => {
    const wrapper = shallow(<ServiceWorkerWrapper />);
    expect(getSnackbar(wrapper).exists()).toBe(true);
  });

  it('should reload the page', () => {
    const wrapper = shallow(<ServiceWorkerWrapper />);
    getSnackbar(wrapper).simulate('click');

    // Skips sw waiting
    expect(postMessageMock).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });
    expect(postMessageMock).toHaveBeenCalledTimes(1);
    // Shows snackbar
    expect(setShowReloadMock).toHaveBeenCalledTimes(1);
    expect(setShowReloadMock).toHaveBeenCalledWith(false);
  });

  it('should register the service worker on mount and set the state accordingly', () => {
    const useEffectSpy = jest.spyOn(React, 'useEffect');
    useEffectSpy.mockImplementationOnce((fn: () => void) => {
      fn();
    });

    shallow(<ServiceWorkerWrapper />);
    expect(useEffectSpy).toHaveBeenCalledTimes(1);
    expect(register).toHaveBeenCalledTimes(1);
    expect(setShowReloadMock).toHaveBeenNthCalledWith(1, true);
    expect(setInstallingWorkerMock).toHaveBeenCalledTimes(1);
  });
});
