import { ZstdCompressor } from './zstd-compressor';

describe('ZstdCompressor', () => {
  const cases = [Buffer.from('🇵🇱🥸🎓'), Buffer.from(''), Buffer.from('💰'.repeat(32767)), Buffer.from([])];

  it.each(cases)('should compress and decompress buffer', async (buffer) => {
    const compressor = new ZstdCompressor();
    const compressed = await compressor.compress(buffer);
    const decompressed = await compressor.decompress(compressed);

    expect(decompressed).toEqual(buffer);
  });

  it('should decrease the size of data', async () => {
    const bigBuffer = Buffer.from('💰'.repeat(32767));
    const compressor = new ZstdCompressor();
    const compressed = await compressor.compress(bigBuffer);

    expect(compressed.length < bigBuffer.length).toEqual(true);
  });
});
