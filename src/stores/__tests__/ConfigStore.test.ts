import ConfigStore from '../ConfigStore';

describe('ConfigStore', () => {
  it('should toggle the lock correctly', () => {
    const config = new ConfigStore();
    expect(config.locked).toBe(false);
    config.toggleLock();
    expect(config.locked).toBe(true);
  });
});
