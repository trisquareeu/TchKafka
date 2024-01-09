import { ScramCredentials } from './scram-credentials';

describe('scram credentials', () => {
  it('should normalize username', () => {
    const inputString = '1234567890-=[];\'",./\\!@#$%^&*()_+';
    const credentials = new ScramCredentials(Buffer.from(inputString), Buffer.from(inputString));

    expect(credentials.username).toEqual('1234567890-=3D[];\'"=2C./\\!@#$%^&*()_+');
    expect(credentials.password).toEqual(inputString);
  });

  it('should throw when non-utf8 username is used', () => {
    expect(() => new ScramCredentials(Buffer.from([0xc0c1]), Buffer.from('password'))).toThrow(
      'Only utf-8 characters are supported'
    );
  });

  it('should throw when non-utf8 password is used', () => {
    expect(() => new ScramCredentials(Buffer.from('username'), Buffer.from([0xc0c1]))).toThrow(
      'Only utf-8 characters are supported'
    );
  });
});
