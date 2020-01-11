import React from 'react';
import Settings from '../Settings';
import { getByTestId } from '../../../__helpers__/helper';
import { shallow, ShallowWrapper } from 'enzyme';

jest.mock('../../stores/useStores');
const { useTimerStore } = require('../../stores/useStores');

describe('Settings component', () => {
  const getForm = (wrapper: ShallowWrapper) => getByTestId(wrapper, 'settings-form');
  const getBreakLengthInput = (wrapper: ShallowWrapper) => getByTestId(wrapper, 'settings-break-length');
  const getPomodoroInput = (wrapper: ShallowWrapper) => getByTestId(wrapper, 'settings-pomodoro-length');

  const setStateMock = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');

  const setPomodoroLengthMock = jest.fn();
  const setBreakLengthMock = jest.fn();
  beforeEach(() => {
    jest.resetAllMocks();
    setStateMock.mockReset();
    useStateSpy.mockImplementation((() => [{ pomodoroLength: 25, breakLength: 5 }, setStateMock]) as any);
    useTimerStore.mockImplementation(() => ({
      pomodoroLength: 25 * 60 * 1000,
      breakLength: 5 * 60 * 1000,
      setPomodoroLength: setPomodoroLengthMock,
      setBreakLength: setBreakLengthMock,
      resetTimer: jest.fn(),
    }));
  });

  it('should render the component', () => {
    const wrapper = shallow(<Settings />);
    expect(getByTestId(wrapper, 'settings-wrapper').exists()).toBe(true);
  });

  it('should set the pomodoro length', async () => {
    let wrapper = shallow(<Settings />);

    getPomodoroInput(wrapper).simulate('change', { target: { value: '5', name: 'pomodoroLength' }, preventDefault: jest.fn() });

    const expectedFormState = { pomodoroLength: 5, breakLength: 5 };
    expect(setStateMock).toHaveBeenCalledWith(expectedFormState);
    useStateSpy.mockImplementation(() => [expectedFormState, setStateMock]);
    wrapper = shallow(<Settings />);
    getForm(wrapper).simulate('submit', { preventDefault: jest.fn() });

    expect(setPomodoroLengthMock).toHaveBeenCalledTimes(1);
    expect(setPomodoroLengthMock).toHaveBeenCalledWith(5 * 60 * 1000);
  });

  it('should set the break length', () => {
    let wrapper = shallow(<Settings />);

    getBreakLengthInput(wrapper).simulate('change', { target: { value: '2', name: 'breakLength' }, preventDefault: jest.fn() });
    const expectedFormState = { pomodoroLength: 25, breakLength: 2 };
    expect(setStateMock).toHaveBeenCalledWith(expectedFormState);
    useStateSpy.mockImplementation(() => [expectedFormState, setStateMock]);
    wrapper = shallow(<Settings />);
    getForm(wrapper).simulate('submit', { preventDefault: jest.fn() });

    expect(setBreakLengthMock).toHaveBeenCalledTimes(1);
    expect(setBreakLengthMock).toHaveBeenCalledWith(2 * 60 * 1000);
  });

  it('should set an form error if value is not valid', () => {
    let wrapper = shallow(<Settings />);

    getBreakLengthInput(wrapper).simulate('change', { target: { value: '-', name: 'breakLength' }, preventDefault: jest.fn() });
    expect(setStateMock).toHaveBeenCalledWith('Invalid value');

    jest.resetAllMocks();
    getPomodoroInput(wrapper).simulate('change', { target: { value: '-', name: 'pomodoroLength' }, preventDefault: jest.fn() });
    expect(setStateMock).toHaveBeenCalledWith('Invalid value');
  });

  it('should set an error if value is negative', () => {
    let wrapper = shallow(<Settings />);

    getBreakLengthInput(wrapper).simulate('change', { target: { value: '-1', name: 'breakLength' }, preventDefault: jest.fn() });

    let expectedFormState = { pomodoroLength: 25, breakLength: -1 };
    expect(setStateMock).toHaveBeenCalledWith(expectedFormState);
    useStateSpy.mockImplementation(() => [expectedFormState, setStateMock]);
    wrapper = shallow(<Settings />);

    getForm(wrapper).simulate('submit', { preventDefault: jest.fn() });
    expect(setStateMock).toHaveBeenCalledWith('Value has to be > 0');

    // reset mocks
    useStateSpy.mockImplementation(() => [{ pomodoroLength: 25, breakLength: 5 }, setStateMock]);
    wrapper = shallow(<Settings />);
    setStateMock.mockReset();

    expectedFormState = { pomodoroLength: -1, breakLength: 5 };
    getPomodoroInput(wrapper).simulate('change', { target: { value: '-1', name: 'pomodoroLength' }, preventDefault: jest.fn() });
    expect(setStateMock).toHaveBeenCalledWith(expectedFormState);
    useStateSpy.mockImplementation(() => [expectedFormState, setStateMock]);
    wrapper = shallow(<Settings />);

    getForm(wrapper).simulate('submit', { preventDefault: jest.fn() });
    expect(setStateMock).toHaveBeenCalledWith('Value has to be > 0');
  });

  it('should be able to add empty value', () => {
    let wrapper = shallow(<Settings />);

    getBreakLengthInput(wrapper).simulate('change', { target: { value: '', name: 'breakLength' }, preventDefault: jest.fn() });
    const expectedFormState = { pomodoroLength: 25, breakLength: '' };
    expect(setStateMock).toHaveBeenCalledWith(expectedFormState);
    useStateSpy.mockImplementation(() => [expectedFormState, setStateMock]);
    wrapper = shallow(<Settings />);

    expect(getBreakLengthInput(wrapper).props().value).toBe('');
  });
});
