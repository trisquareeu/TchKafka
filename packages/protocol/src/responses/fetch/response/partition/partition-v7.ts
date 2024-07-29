/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Array, Int16, Int32, Int64, RecordBatch } from '../../../../primitives';
import { ReadBuffer } from '../../../../serialization';
import { AbortedTransactionV7 } from './aborted-transaction/aborted-transaction-v7';

export class PartitionV7 {
  constructor(
    public readonly index: Int32,
    public readonly errorCode: Int16,
    public readonly highWatermark: Int64,
    public readonly lastStableOffset: Int64,
    public readonly logStartOffset: Int64,
    public readonly abortedTransactions: Array<AbortedTransactionV7>,
    public readonly recordBatches: RecordBatch[]
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<PartitionV7> {
    const index = await Int32.deserialize(buffer);
    const errorCode = await Int16.deserialize(buffer);
    const highWatermark = await Int64.deserialize(buffer);
    const lastStableOffset = await Int64.deserialize(buffer);
    const logStartOffset = await Int64.deserialize(buffer);
    const abortedTransactions = await Array.deserialize(buffer, AbortedTransactionV7.deserialize);
    const messagesSize = await Int32.deserialize(buffer);

    const records: RecordBatch[] = [];
    if (messagesSize.value > 0) {
      const messagesBuffer = new ReadBuffer(buffer.readBuffer(messagesSize.value));
      // TODO: Figure out something less stupid
      while (true) {
        try {
          records.push(await RecordBatch.deserialize(messagesBuffer));
        } catch (e) {
          break;
        }
      }
    }

    return new PartitionV7(
      index,
      errorCode,
      highWatermark,
      lastStableOffset,
      logStartOffset,
      abortedTransactions,
      records
    );
  }
}
