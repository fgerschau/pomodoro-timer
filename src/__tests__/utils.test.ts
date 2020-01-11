import {initializeNotifications, emitAlert} from "../utils";
import {flushPromises} from "../../__helpers__/helper";


describe('utils file', () => {
  afterEach(() => {
    const notificationMock = jest.fn();
    (notificationMock as any).permission = 'default';
    (window as any).Notification = notificationMock;

    jest.resetAllMocks();
  });

  it('should initialize the audio', () => {
    const playMock = jest.fn();
    window.HTMLMediaElement.prototype.play = playMock;
    const notificationMock = jest.fn();
    (notificationMock as any).permission = 'granted';
    (window as any).Notification = notificationMock;

    initializeNotifications();
    expect(playMock).toHaveBeenCalledTimes(1);
  });

  it('should request notification permission', () => {
    const requestPermission = jest.fn();
    const notificationMock = jest.fn();
    (notificationMock as any).permission = 'default';
    (notificationMock as any).requestPermission = requestPermission;
    (window as any).Notification = notificationMock;
    initializeNotifications();
    expect(requestPermission).toHaveBeenCalledTimes(1);
  });

  it('should play the audio', () => {
    const playMock = jest.fn();
    window.HTMLMediaElement.prototype.play = playMock;
    emitAlert();
    expect(playMock).toHaveBeenCalledTimes(1);
  });

  it('shouldn\'t play anything if Audio is not supported', async () => {
    jest.useFakeTimers();

    const playMock = jest.fn();
    window.HTMLMediaElement.prototype.play = playMock;
    window.Audio = null as any;

    const vibrateMock = jest.fn();
    navigator.vibrate = vibrateMock;
    emitAlert();
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

  it('should create a notification if permission is granted', () => {
    const notificationMock = jest.fn();
    (notificationMock as any).permission = 'granted';
    (window as any).Notification = notificationMock;
    emitAlert();
    expect(notificationMock).toHaveBeenCalledTimes(1);
  });
});
