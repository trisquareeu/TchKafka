import { ReadBuffer } from '../../../protocol/serialization';

type FullResponseCallback = (response: ReadBuffer) => any;
export class ResponseReader {
  private buffer: Buffer = Buffer.from([]);

  constructor(private readonly onFullResponseReceived: FullResponseCallback) {}

  public maybeReadResponse(stream: Buffer): void {
    this.buffer = Buffer.concat([this.buffer, stream]);
    const responseLength = this.getNextResponseLength(this.buffer);
    if (responseLength > 0) {
      const response = this.buffer.subarray(4, responseLength); //take the response from the socket buffer without the first int32 indicating the response length
      this.buffer = this.buffer.subarray(responseLength); //remove the response from the socket buffer
      this.onFullResponseReceived(new ReadBuffer(response));
    }
  }

  private getNextResponseLength(buffer: Buffer): number {
    //response starts with the int32
    if (buffer.length < 4) {
      return 0; //the response is not received yet
    }

    const expectedLength = buffer.readInt32BE() + 4; //4 bytes of the int32 + value from the int32
    if (buffer.length < expectedLength) {
      return 0; //the response is not received yet
    }

    return expectedLength;
  }
}
