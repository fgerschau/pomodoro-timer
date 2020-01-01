import {initializeSound, emitAlertNoise} from "../utils";
import {flushPromises} from "../../__helpers__/helper";


describe('utils file', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should initialize the audio', () => {
    const playMock = jest.fn();
    window.HTMLMediaElement.prototype.play = playMock;
    initializeSound();
    expect(playMock).toHaveBeenCalledTimes(1);
  });

  it('should play the audio', () => {
    const playMock = jest.fn();
    window.HTMLMediaElement.prototype.play = playMock;
    emitAlertNoise();
    expect(playMock).toHaveBeenCalledTimes(1);
  });

  it('shouldn\'t play anything if Audio is not supported', async () => {
    jest.useFakeTimers();

    const playMock = jest.fn();
    window.HTMLMediaElement.prototype.play = playMock;
    window.Audio = null as any;

    const vibrateMock = jest.fn();
    navigator.vibrate = vibrateMock;
    emitAlertNoise();
    expect(playMock).toHaveBeenCalledTimes(0);
    jest.runAllTimers();
    await flushPromises();
    jest.runAllTimers();
    await flushPromises();
    expect(vibrateMock).toHaveBeenCalledTimes(3);
  });

  it('should work if vibrate is not supported', () => {
    navigator.vibrate = null as any;
  });
});
