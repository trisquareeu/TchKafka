/* eslint-disable @typescript-eslint/no-array-constructor */
import { NullInNonNullableFieldError } from '../exceptions';
import { ReadBuffer, WriteBuffer } from '../serialization';
import { Array } from './array';
import { Int8 } from './int8';
import { NonNullableArray } from './non-nullable-array';

describe('NonNullableArray', () => {
  it('should throw when deserializing null', async () => {
    const array = new Array(null, async () => {
      // no-op
    });

    const writeBuffer = new WriteBuffer();
    await array.serialize(writeBuffer);
    const readBuffer = new ReadBuffer(writeBuffer.toBuffer());

    expect(() =>
      NonNullableArray.deserialize(readBuffer, () => {
        // no-op
      })
    ).toThrowError(NullInNonNullableFieldError);
  });

  it('should deserialize serialized array', async () => {
    const array = new Array([new Int8(1), new Int8(2)], async (item, buffer) => await item.serialize(buffer));

    const writeBuffer = new WriteBuffer();
    await array.serialize(writeBuffer);
    const readBuffer = new ReadBuffer(writeBuffer.toBuffer());

    const deserialized = NonNullableArray.deserialize(readBuffer, (buffer) => Int8.deserialize(buffer));
    expect(deserialized.value).toEqual(array.value);
  });
});
