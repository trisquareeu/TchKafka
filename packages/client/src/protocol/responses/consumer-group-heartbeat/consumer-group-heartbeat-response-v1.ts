import { TagSection, type ReadBuffer } from '../..';
import { CompactNullableString, Int16, Int32, Nullable } from '../../primitives';
import { AssignmentV1 } from './assignment';

export class ConsumerGroupHeartbeatResponseV1Data {
  constructor(
    public readonly throttleTimeMs: Int32,
    public readonly errorCode: Int16,
    public readonly errorMessage: CompactNullableString,
    public readonly memberId: CompactNullableString,
    public readonly memberEpoch: Int32,
    public readonly heartbeatIntervalMs: Int32,
    public readonly assignment: Nullable<AssignmentV1>,
    public readonly tags: TagSection
  ) {}

  public static deserialize(buffer: ReadBuffer): ConsumerGroupHeartbeatResponseV1Data {
    const throttleTimeMs = Int32.deserialize(buffer);
    const errorCode = Int16.deserialize(buffer);
    const errorMessage = CompactNullableString.deserialize(buffer);
    const memberId = CompactNullableString.deserialize(buffer);
    const memberEpoch = Int32.deserialize(buffer);
    const heartbeatIntervalMs = Int32.deserialize(buffer);
    const assignment = Nullable.deserialize(buffer, (buffer) => AssignmentV1.deserialize(buffer));
    const tags = TagSection.deserialize(buffer);

    return new ConsumerGroupHeartbeatResponseV1Data(
      throttleTimeMs,
      errorCode,
      errorMessage,
      memberId,
      memberEpoch,
      heartbeatIntervalMs,
      assignment,
      tags
    );
  }
}
