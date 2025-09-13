import { waitFor } from './wait-for';

describe('waitFor', () => {
  jest.useFakeTimers();

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it('resolves immediately if condition succeeds on first attempt', async () => {
    const condition = jest.fn().mockResolvedValue('success');
    const promise = waitFor(condition);
    jest.runOnlyPendingTimers();
    await expect(promise).resolves.toBe('success');
    expect(condition).toHaveBeenCalledTimes(1);
  });

  it('retries until condition succeeds', async () => {
    const condition = jest.fn().mockRejectedValueOnce(new Error('fail')).mockResolvedValueOnce('ok');
    const promise = waitFor(condition, { interval: 100, maxAttempts: 3 });
    jest.advanceTimersByTime(100); // first attempt (fail)
    jest.advanceTimersByTime(100); // second attempt (ok)
    await expect(promise).resolves.toBe('ok');
    expect(condition).toHaveBeenCalledTimes(2);
  });

  it('rejects if maxAttempts is reached', async () => {
    const condition = jest.fn().mockRejectedValue(new Error('fail'));
    const promise = waitFor(condition, { interval: 50, maxAttempts: 2 });
    jest.advanceTimersByTime(50); // 1st
    jest.advanceTimersByTime(50); // 2nd
    jest.advanceTimersByTime(50); // 3rd (exceeds maxAttempts)
    await expect(promise).rejects.toThrow('Max attempts reached');
    expect(condition).toHaveBeenCalledTimes(3);
  });

  it('uses default configuration if none provided', async () => {
    const condition = jest.fn().mockRejectedValueOnce(new Error('fail')).mockResolvedValueOnce('done');
    const promise = waitFor(condition);
    jest.advanceTimersByTime(100); // 1st (fail)
    jest.advanceTimersByTime(100); // 2nd (done)
    await expect(promise).resolves.toBe('done');
    expect(condition).toHaveBeenCalledTimes(2);
  });

  it('works with synchronous condition', async () => {
    let called = false;
    const condition = jest.fn(() => {
      if (!called) {
        called = true;
        throw new Error('fail');
      }

      return 'sync';
    });
    const promise = waitFor(condition, { interval: 10, maxAttempts: 2 });
    jest.advanceTimersByTime(10); // 1st (fail)
    jest.advanceTimersByTime(10); // 2nd (sync)
    await expect(promise).resolves.toBe('sync');
    expect(condition).toHaveBeenCalledTimes(2);
  });
});
