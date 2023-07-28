import type { ReadBuffer, Serializable, WriteBuffer } from '../serialization';
import { UVarInt } from '../primitives';
import { TaggedField } from './tagged-field';
import { InvalidOrOutOfOrderTagError } from '../exceptions';

/**
 * Tagged fields can appear at the top level of a message, or inside any structure.
 *
 * In a flexible version, each structure ends with a tag section. This section stores all of the tagged fields in
 * the structure. The tag section begins with a number of tagged fields, serialized as a variable-length integer.
 * If this number is 0, there are no tagged fields present.  In that case, the tag section takes up only one byte.
 * If the number of tagged fields is greater than zero, the tagged fields follow.
 * They are serialized in ascending order of their tag.  Each tagged field begins with a tag header.
 *
 * Each optional field has a 31-bit tag number. This number must be unique within the context it appears in.
 * For example, we could use the tag number "1" both at the top level and within a particular substructure without
 * creating ambiguity, since the contexts are separate. Tagged fields can have any type.
 *
 * @see https://kafka.apache.org/24/protocol.html#protocol_compatibility
 * @see https://cwiki.apache.org/confluence/display/KAFKA/KIP-482%3A+The+Kafka+Protocol+should+Support+Optional+Tagged+Fields
 */
export class TagSection implements Serializable {
  public readonly fields: Readonly<TaggedField[]>;

  constructor(fields: TaggedField[] = []) {
    //check the tags ordering
    for (let i = 0; i < fields.length - 1; i++) {
      if (fields[i]!.tag.value > fields[i + 1]!.tag.value) {
        throw new InvalidOrOutOfOrderTagError(`Invalid or out-of-order tag ${fields[i + 1]!.tag.value}`);
      }
    }

    this.fields = [...fields];
  }

  public static deserialize(buffer: ReadBuffer): TagSection {
    const numberOfTaggedFields = UVarInt.deserialize(buffer).value;
    const taggedFields: TaggedField[] = [];
    for (let i = 0; i < numberOfTaggedFields; i++) {
      taggedFields.push(TaggedField.deserialize(buffer));
    }

    return new TagSection(taggedFields);
  }

  public serialize(buffer: WriteBuffer): void {
    new UVarInt(this.fields.length).serialize(buffer);
    this.fields.forEach((value) => value.serialize(buffer));
  }
}
