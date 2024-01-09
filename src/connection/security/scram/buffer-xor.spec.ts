import { xor } from './buffer-xor';

describe('buffer xor', () => {
  it('should correctly xor two bytes in the right order', () => {
    const byteA = 0b0000110011000000;
    const byteB = 0b0000101010100000;

    const result = xor(Buffer.from([byteA]), Buffer.from([byteB]));

    expect(result).toEqual(Buffer.from([0b0000011001100000]));
  });

  it('should return an empty buffer when both arguments are empty', () => {
    const result = xor(Buffer.alloc(0), Buffer.alloc(0));

    expect(result).toEqual(Buffer.alloc(0));
  });

  it('should throw an error when buffers are not same size', () => {
    expect(() => xor(Buffer.allocUnsafe(1), Buffer.allocUnsafe(2))).toThrow(
      'Argument arrays must be of the same length'
    );
  });
});
