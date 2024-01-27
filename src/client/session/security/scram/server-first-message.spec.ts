import { ServerFirstMessage } from './server-first-message';

describe('ServerFirstMessage', () => {
  it('should correctly parse formatted input', () => {
    const serverNonce = 'rOprNGfwEbeRWgbNEkqO%hvYDpWUa2RaTCAfuxFIlj)hNlF$k0';
    const salt = 'saltValue';
    const iterations = 4096;
    const serverFirstMessageData = `r=${serverNonce},s=${btoa(salt)},i=${iterations}`;

    const serverFirstMessage = new ServerFirstMessage(serverFirstMessageData);

    expect(serverFirstMessage.original).toEqual(serverFirstMessageData);
    expect(serverFirstMessage.salt.toString()).toEqual(salt);
    expect(serverFirstMessage.serverNonce).toEqual(serverNonce);
    expect(serverFirstMessage.iterations).toEqual(iterations);
  });

  it('should correctly parse formatted input with optional parts', () => {
    const serverNonce = 'rOprNGfwEbeRWgbNEkqO%hvYDpWUa2RaTCAfuxFIlj)hNlF$k0';
    const salt = 'saltValue';
    const iterations = 4096;
    const serverFirstMessageData = `m=d,r=${serverNonce},s=${btoa(salt)},i=${iterations},d=whatever`;

    const serverFirstMessage = new ServerFirstMessage(serverFirstMessageData);

    expect(serverFirstMessage.original).toEqual(serverFirstMessageData);
    expect(serverFirstMessage.salt.toString()).toEqual(salt);
    expect(serverFirstMessage.serverNonce).toEqual(serverNonce);
    expect(serverFirstMessage.iterations).toEqual(iterations);
  });

  it('should throw an exception when salt is not base64-enocded', () => {
    const serverNonce = 'rOprNGfwEbeRWgbNEkqO%hvYDpWUa2RaTCAfuxFIlj)hNlF$k0';
    const salt = 'saltValue';
    const iterations = 4096;
    const serverFirstMessageData = `r=${serverNonce},s=${salt},i=${iterations}`;

    expect(() => new ServerFirstMessage(serverFirstMessageData)).toThrow(
      `Invalid SCRAM server first message format: ${serverFirstMessageData}`
    );
  });

  it('should throw an exception when iterations count is negative', () => {
    const serverNonce = 'rOprNGfwEbeRWgbNEkqO%hvYDpWUa2RaTCAfuxFIlj)hNlF$k0';
    const salt = 'saltValue';
    const iterations = -4096;
    const serverFirstMessageData = `r=${serverNonce},s=${btoa(salt)},i=${iterations}`;

    expect(() => new ServerFirstMessage(serverFirstMessageData)).toThrow(
      `Invalid SCRAM server first message format: ${serverFirstMessageData}`
    );
  });

  it('should throw an exception when server nonce is missing', () => {
    const salt = 'saltValue';
    const iterations = 4096;
    const serverFirstMessageData = `s=${btoa(salt)},i=${iterations}`;

    expect(() => new ServerFirstMessage(serverFirstMessageData)).toThrowError(
      `Invalid SCRAM server first message format: ${serverFirstMessageData}`
    );
  });
});
