import { NoopCompressor } from './noop-compressor';

describe('NoopCompressor', () => {
  const cases = [Buffer.from([]), Buffer.from('🇵🇱🥸🎓'), Buffer.from(''), Buffer.from('💰'.repeat(32767))];

  it.each(cases)('compress should return the same array', async (buffer) => {
    const compressor = new NoopCompressor();

    const compressed = await compressor.compress(buffer);
    const decompressed = await compressor.decompress(buffer);

    expect(compressed).toEqual(buffer);
    expect(decompressed).toEqual(buffer);
  });
});
