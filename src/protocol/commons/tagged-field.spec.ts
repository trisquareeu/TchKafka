import { TaggedField } from './tagged-field';
import { UVarInt } from '../primitives';
import { WriteBuffer } from '../serialization';

describe('TaggedField', () => {
  it('should correctly serialize empty tags', () => {
    const taggedField = new TaggedField(new UVarInt(0), Buffer.from([]));
    const buffer = new WriteBuffer();
    taggedField.serialize(buffer);

    expect(buffer.toBuffer()).toEqual(Buffer.from([0x00, 0x00]));
  });

  it('should correctly serialize non-empty tags', () => {
    const taggedField = new TaggedField(new UVarInt(2), Buffer.from([0x01, 0x02, 0x03]));
    const buffer = new WriteBuffer();
    taggedField.serialize(buffer);

    expect(buffer.toBuffer()).toEqual(Buffer.from([0x02, 0x03, 0x01, 0x02, 0x03]));
  });
});
