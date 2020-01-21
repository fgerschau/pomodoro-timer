import React from 'react';
import Timer from '../Timer';
import { getByTestId } from '../../../__helpers__/helper';
import { shallow } from 'enzyme';

jest.mock('../../stores/useStores');
const { useTimerStore } = require('../../stores/useStores');

const produceComponent = () => {
  return shallow(
    <Timer />
  );
};

describe('Timer component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    useTimerStore.mockImplementation(() => ({
      resetTimer: jest.fn(),
      timeLeftFormatted: '0:00',
    }));
  });

  it('renders the component', () => {
    const wrapper = produceComponent();
    expect(getByTestId(wrapper, 'timer-timeleft').text()).toBe('0:00');
  });

  it('sets the timer to break', () => {
    const resetMock = jest.fn();
    useTimerStore.mockImplementation(() => ({
      resetTimer: resetMock,
      timeLeftFormatted: '0:00',
    }));

    const wrapper = produceComponent();
    getByTestId(wrapper, 'timer-set-break').simulate('click');
    expect(resetMock).toHaveBeenCalledTimes(1);
    expect(resetMock).toHaveBeenCalledWith('break');
  });

  it('sets the timer to pomodoro', () => {
    const resetMock = jest.fn();
    useTimerStore.mockImplementation(() => ({
      resetTimer: resetMock,
      timeLeftFormatted: '0:00',
    }));

    const wrapper = produceComponent();
    getByTestId(wrapper, 'timer-set-pomodoro').simulate('click');
    expect(resetMock).toHaveBeenCalledTimes(1);
    expect(resetMock).toHaveBeenCalledWith('pomodoro');
  });

  it('sets the timer to a long break', () => {
    const resetMock = jest.fn();
    useTimerStore.mockImplementation(() => ({
      resetTimer: resetMock,
      timeLeftFormatted: '0:00',
    }));

    const wrapper = produceComponent();
    getByTestId(wrapper, 'timer-set-long-break').simulate('click');
    expect(resetMock).toHaveBeenCalledTimes(1);
    expect(resetMock).toHaveBeenCalledWith('long-break');
  });

  it('highlights the current state', () => {
    useTimerStore.mockImplementation(() => ({
      timeLeftFormatted: '0:00',
      timerState: 'pomodoro',
    }));
    let wrapper = produceComponent();
    expect(getByTestId(wrapper, 'timer-set-pomodoro').prop('variant')).toBe('contained');
    expect(getByTestId(wrapper, 'timer-set-long-break').prop('variant')).toBe('outlined');
    expect(getByTestId(wrapper, 'timer-set-break').prop('variant')).toBe('outlined');

    useTimerStore.mockImplementation(() => ({
      timeLeftFormatted: '0:00',
      timerState: 'break',
    }));
    wrapper = produceComponent();
    expect(getByTestId(wrapper, 'timer-set-break').prop('variant')).toBe('contained');
    expect(getByTestId(wrapper, 'timer-set-pomodoro').prop('variant')).toBe('outlined');
    expect(getByTestId(wrapper, 'timer-set-long-break').prop('variant')).toBe('outlined');

    useTimerStore.mockImplementation(() => ({
      timeLeftFormatted: '0:00',
      timerState: 'long-break',
    }));
    wrapper = produceComponent();
    expect(getByTestId(wrapper, 'timer-set-long-break').prop('variant')).toBe('contained');
    expect(getByTestId(wrapper, 'timer-set-pomodoro').prop('variant')).toBe('outlined');
    expect(getByTestId(wrapper, 'timer-set-break').prop('variant')).toBe('outlined');
  });
});
