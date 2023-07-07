import { WriteBuffer } from './write-buffer';

describe('WriteBuffer', () => {
  let buffer: WriteBuffer;

  beforeEach(() => {
    buffer = new WriteBuffer();
  });

  const magicNumber = 42;
  const cases = [
    { method: (wb: WriteBuffer) => wb.writeInt8(magicNumber), numberOfBytes: 1 },
    { method: (wb: WriteBuffer) => wb.writeInt16(magicNumber), numberOfBytes: 2 },
    { method: (wb: WriteBuffer) => wb.writeInt32(magicNumber), numberOfBytes: 4 },
    { method: (wb: WriteBuffer) => wb.writeInt64(BigInt(magicNumber)), numberOfBytes: 8 },
    { method: (wb: WriteBuffer) => wb.writeUInt8(magicNumber), numberOfBytes: 1 },
    { method: (wb: WriteBuffer) => wb.writeUInt16(magicNumber), numberOfBytes: 2 },
    { method: (wb: WriteBuffer) => wb.writeUInt32(magicNumber), numberOfBytes: 4 },
    { method: (wb: WriteBuffer) => wb.writeUInt64(BigInt(magicNumber)), numberOfBytes: 8 }
  ];

  it.each(cases)(
    'Should allocate expected number of bytes and write the value in the BE-order',
    ({ method, numberOfBytes }) => {
      const expectedResult = Buffer.allocUnsafe(numberOfBytes).fill(0);
      expectedResult.writeUInt8(magicNumber, numberOfBytes - 1);

      expect(method(buffer).toBuffer()).toEqual(expectedResult);
    }
  );
});
