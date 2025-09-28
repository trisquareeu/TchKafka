import {
  CorrelationIdMismatchError,
  ReadBuffer,
  WriteBuffer,
  type Request,
  type RequestResponseType
} from '../../protocol';
import { type Socket } from 'net';
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
    socket.on('error', (error) => this.onError(error));
    socket.on('error', (error) => this.onError(error));
  }

  public async send<T extends Request<any>>(request: T, expectResponse?: true): Promise<RequestResponseType<T>>;
  public async send<T extends Request<any>>(request: T, expectResponse: false): Promise<undefined>;
  public async send<T extends Request<any>>(
    request: T,
    expectResponse: boolean
  ): Promise<RequestResponseType<T> | undefined>;
  public async send<T extends Request<any>>(
    request: T,
    expectResponse = true
  ): Promise<RequestResponseType<T> | undefined> {
    const serializedRequest = await this.serializeRequest(request);

    this.doSend(serializedRequest);

    if (expectResponse) {
      const response = await this.expectResponse();

      return this.deserializeResponse(response, request);
    }

    return undefined;
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

  private doSend(data: Buffer): void {
    const header = Buffer.alloc(4);
    header.writeInt32BE(data.length);
    this.socket.write(Buffer.concat([header, data]));
  }

  private async expectResponse(): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      this.inFlightRequests.push({ resolve, reject });
    });
  }

  private resolveResponse(buffer: Buffer): void {
    const oldestRequest = this.inFlightRequests.shift();
    if (oldestRequest === undefined) {
      this.onError(new Error('Received response without a matching request'));

      return;
    }
    oldestRequest.resolve(buffer);
  }

  private onError(error: Error): void {
    for (const request of this.inFlightRequests) {
      request.reject(error);
    }
    this.socket.destroy(error);
  }
}
