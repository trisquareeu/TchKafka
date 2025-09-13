export type WaitForConfiguration = {
  interval: number;
  maxAttempts: number;
};

/**
 * Wait until the callback does not throw an error.
 * @param condition
 * @param param1
 */
export const waitFor = <T>(
  condition: () => T | Promise<T>,
  { interval, maxAttempts }: WaitForConfiguration = { interval: 100, maxAttempts: 10 }
): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    let attempts = 0;

    const intervalId = setInterval(async () => {
      attempts++;

      try {
        const result = await condition();
        clearInterval(intervalId);
        resolve(result);
      } catch (error) {
        if (attempts > maxAttempts) {
          clearInterval(intervalId);
          reject(new Error('Max attempts reached'));
        }
      }
    }, interval);
  });
};
