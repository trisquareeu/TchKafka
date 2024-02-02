export const xor = (bufferA: Buffer, bufferB: Buffer): Buffer => {
  if (Buffer.byteLength(bufferA) !== Buffer.byteLength(bufferB)) {
    throw new Error('Argument arrays must be of the same length');
  }

  const result = Buffer.allocUnsafe(bufferA.length);
  for (let i = 0; i < Buffer.byteLength(bufferA); i++) {
    result[i] = bufferA[i]! ^ bufferB[i]!;
  }

  return result;
};
