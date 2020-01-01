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
    const wrapper = shallow(<MenuBar />);
    expect(getByTestId(wrapper, 'app-wrapper').exists()).toBe(true);
  });

  it('renders a different icon depending on whether the timer is running or not', () => {
    let wrapper = shallow(<MenuBar />);
    expect(getByTestId(wrapper, 'menubar-play-icon').exists()).toBe(true);
    useTimerStore.mockImplementation(() => ({ running: true }));
    wrapper = shallow(<MenuBar />);
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
    let wrapper = shallow(<MenuBar />);

    timerToggleElement(wrapper).simulate('click');
    expect(startTimerMock).toHaveBeenCalledTimes(1);

    useTimerStore.mockImplementation(() => ({
      running: true,
      startTimer: startTimerMock,
      pauseTimer: pauseTimerMock,
    }));
    wrapper = shallow(<MenuBar />);
    timerToggleElement(wrapper).simulate('click');
    expect(pauseTimerMock).toHaveBeenCalledTimes(1);
  });

  it('resets the timer', () => {
    const resetTimerMock = jest.fn();
    useTimerStore.mockImplementation(() => ({ running: true, resetTimer: resetTimerMock }));
    const wrapper = shallow(<MenuBar />);
    const resetButtonElement = getByTestId(wrapper, 'menubar-reset-button');
    resetButtonElement.simulate('click');
    expect(resetTimerMock).toHaveBeenCalledTimes(1);
  });

  it('should initialize sound when clicking on play', () => {
    const initializeSoundMock = jest.fn();
    initializeSound.mockImplementation(initializeSoundMock);
    const wrapper = shallow(<MenuBar />);
    getByTestId(wrapper, 'menubar-play-toggle').simulate('click');
    expect(initializeSoundMock).toHaveBeenCalledTimes(1);
  });
});
