import { type Socket } from 'net';
import { type Request, type RequestResponseType } from '../../../protocol/requests';
import { ReadBuffer, WriteBuffer } from '../../../protocol/serialization';
import { CorrelationIdMismatchError } from '../../../protocol/exceptions';
import { ResponseReader } from './response-reader';

type InflightRequest<T> = {
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: Error) => void;
};

export class Connection {
  private readonly responseReader: ResponseReader;
  private readonly inFlightRequests: InflightRequest<any>[] = [];

  constructor(private readonly socket: Socket) {
    this.responseReader = new ResponseReader(this.resolveResponse.bind(this));
    socket.on('data', (stream) => this.responseReader.maybeReadResponse(stream));
  }

  public async send<T extends Request<any>>(request: T): Promise<RequestResponseType<T>> {
    const serializedRequest = await this.serializeRequest(request);

    const response = await this.doSend(serializedRequest);

    return this.deserializeResponse(response, request);
  }

  public isHealthy(): boolean {
    return this.socket.writable && this.socket.readable;
  }

  private async serializeRequest(request: Request<any>): Promise<Buffer> {
    const serializedRequest = new WriteBuffer();
    await request.serialize(serializedRequest);

    return serializedRequest.toBuffer();
  }

  private deserializeResponse<T>(response: Buffer, request: Request<T>): T {
    const readBuffer = new ReadBuffer(response);
    const { correlationId } = request.ExpectedResponseHeaderClass.deserialize(readBuffer);
    if (correlationId.value !== request.header.correlationId.value) {
      throw new CorrelationIdMismatchError('Received response with unexpected correlation ID');
    }

    return request.ExpectedResponseDataClass.deserialize(readBuffer);
  }

  private async doSend(data: Buffer): Promise<Buffer> {
    const header = Buffer.alloc(4);
    header.writeInt32BE(data.length);
    this.socket.write(Buffer.concat([header, data]));

    return new Promise((resolve, reject) => {
      this.inFlightRequests.push({ resolve, reject });
    });
  }

  private resolveResponse(buffer: Buffer): void {
    const oldestRequest = this.inFlightRequests.shift();
    if (oldestRequest === undefined) {
      // TODO: Close connection and cancel all inflight requests
      throw new Error('Received response without a matching request');
    }
    oldestRequest.resolve(buffer);
  }
}
