import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { getByTestId } from '../../../__helpers__/helper';
import MenuBar from '../MenuBar';

jest.mock('../../stores/useStores', () => ({
  useTimerStore: jest.fn(() => ({
    running: false,
    startTimer: jest.fn(),
    pauseTimer: jest.fn(),
  })),
}));
jest.mock('../../utils', () => ({
  initializeSound: jest.fn(),
}));


const { useTimerStore } = require('../../stores/useStores');
const { initializeSound } = require('../../utils');

const produceComponent = (historyPush?: Function, pathname?: string) => {
  const historyMock = historyPush ?? jest.fn();
  return shallow(
    <MenuBar.WrappedComponent
      history={{ push: historyMock, location: { pathname: pathname || '/' } } as any}
      location={{} as any}
      match={jest.fn() as any}
    />
  );
};

describe('MenuBar component', () => {
  beforeEach(() => {
    jest.resetModules();
    useTimerStore.mockImplementation(() => ({
      running: false,
      startTimer: jest.fn(),
      pauseTimer: jest.fn(),
    }));
  });

  it('renders the component', () => {
    const wrapper = produceComponent();
    expect(getByTestId(wrapper, 'app-wrapper').exists()).toBe(true);
  });

  it('renders a different icon depending on whether the timer is running or not', () => {
    let wrapper = produceComponent();
    expect(getByTestId(wrapper, 'menubar-play-icon').exists()).toBe(true);
    useTimerStore.mockImplementation(() => ({ running: true }));
    wrapper = produceComponent();
    expect(getByTestId(wrapper, 'menubar-stop-icon').exists()).toBe(true);
  });

  it('executes start and stop timer on button click', () => {
    const timerToggleElement = (wr: ShallowWrapper) => getByTestId(wr, 'menubar-play-toggle');
    const startTimerMock = jest.fn();
    const pauseTimerMock = jest.fn();
    useTimerStore.mockImplementation(() => ({
      running: false,
      startTimer: startTimerMock,
      pauseTimer: pauseTimerMock,
    }));
    let wrapper = produceComponent();

    timerToggleElement(wrapper).simulate('click');
    expect(startTimerMock).toHaveBeenCalledTimes(1);

    useTimerStore.mockImplementation(() => ({
      running: true,
      startTimer: startTimerMock,
      pauseTimer: pauseTimerMock,
    }));
    wrapper = produceComponent();
    timerToggleElement(wrapper).simulate('click');
    expect(pauseTimerMock).toHaveBeenCalledTimes(1);
  });

  it('resets the timer', () => {
    const resetTimerMock = jest.fn();
    useTimerStore.mockImplementation(() => ({ running: true, resetTimer: resetTimerMock }));
    const wrapper = produceComponent();
    const resetButtonElement = getByTestId(wrapper, 'menubar-reset-button');
    resetButtonElement.simulate('click');
    expect(resetTimerMock).toHaveBeenCalledTimes(1);
  });

  it('should initialize sound when clicking on play', () => {
    const initializeSoundMock = jest.fn();
    initializeSound.mockImplementation(initializeSoundMock);
    const wrapper = produceComponent();
    getByTestId(wrapper, 'menubar-play-toggle').simulate('click');
    expect(initializeSoundMock).toHaveBeenCalledTimes(1);
  });

  it('should render the correct icon', () => {
    const historyMock = jest.fn();
    let wrapper = produceComponent(historyMock, '/');
    expect(getByTestId(wrapper, 'menubar-settings-link').exists()).toBe(true);
    wrapper = produceComponent(historyMock, '/settings');
    expect(getByTestId(wrapper, 'menubar-home-link').exists()).toBe(true);
  });

  it('should redirect to correct route when clicking on an icon', () => {
    const historyMock = jest.fn();
    let wrapper = produceComponent(historyMock, '/');
    getByTestId(wrapper, 'menubar-settings-link').simulate('click');
    expect(historyMock).toHaveBeenCalledTimes(1);
    expect(historyMock).toHaveBeenCalledWith('/settings');

    historyMock.mockClear();
    wrapper = produceComponent(historyMock, '/settings');
    getByTestId(wrapper, 'menubar-home-link').simulate('click');
    expect(historyMock).toHaveBeenCalledTimes(1);
    expect(historyMock).toHaveBeenCalledWith('/');
  });
});
