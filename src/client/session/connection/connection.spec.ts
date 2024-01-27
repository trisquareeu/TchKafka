import { type DeepMocked, createMock } from '@golevelup/ts-jest';
import { Buffer } from 'buffer';
import { Socket } from 'net';
import { Int32 } from '../../../protocol/primitives';
import { type RequestHeader, type Request } from '../../../protocol/requests';
import { Connection } from './connection';
import { ReadBuffer } from '../../../protocol/serialization';

describe('Connection', () => {
  let clientSocket: MockedSocket;
  let connection: Connection;

  beforeEach(async () => {
    clientSocket = new MockedSocket();
    connection = new Connection(clientSocket);
  });

  it('should be able to wait for all parts of data', async () => {
    const request = new RequestMock().withDeserializeData({});
    const result = connection.send(request.mock);
    const spy = jest.spyOn(request.mock.ExpectedResponseHeaderClass, 'deserialize');

    //the payload length indicator is received in two parts
    setImmediate(() => clientSocket.emit('data', Buffer.from([0x00, 0x00])));
    setTimeout(() => clientSocket.emit('data', Buffer.from([0x00, 0x05])), 25);

    //the payload is received in three parts
    setTimeout(() => clientSocket.emit('data', Buffer.from([0x01, 0x02])), 50);
    setTimeout(() => clientSocket.emit('data', Buffer.from([0x03, 0x04])), 75);
    setTimeout(() => clientSocket.emit('data', Buffer.from([0x05])), 100);

    //the result should be complete and consolidated
    await expect(result).resolves.toBeDefined();
    expect(spy).toHaveBeenCalledWith(new ReadBuffer(Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05])));
  });

  it('should correctly handle the empty payloads', async () => {
    const request = new RequestMock().withDeserializeData({});
    const result = connection.send(request.mock);
    const spy = jest.spyOn(request.mock.ExpectedResponseHeaderClass, 'deserialize');

    setImmediate(() => clientSocket.emit('data', Buffer.from([0x00, 0x00, 0x00, 0x00])));

    await expect(result).resolves.toBeDefined();
    expect(clientSocket.dataSent).toEqual(Buffer.from([0x00, 0x00, 0x00, 0x00]));
    expect(spy).toHaveBeenCalledWith(new ReadBuffer(Buffer.from([])));
  });

  it('should send data and resolve promises in correct order', async () => {
    const request1 = new RequestMock(133).withSerialize(Buffer.from([0xfa])).withDeserializeData('response1');
    const result1 = connection.send(request1.mock);
    const spy1 = jest.spyOn(request1.mock.ExpectedResponseHeaderClass, 'deserialize');
    setTimeout(() => clientSocket.emit('data', Buffer.from([0x00, 0x00, 0x00, 0x01, 0xf1])), 25);

    const request2 = new RequestMock(213).withSerialize(Buffer.from([0xfb])).withDeserializeData('response2');
    const result2 = connection.send(request2.mock);
    const spy2 = jest.spyOn(request2.mock.ExpectedResponseHeaderClass, 'deserialize');
    setTimeout(() => clientSocket.emit('data', Buffer.from([0x00, 0x00, 0x00, 0x02, 0xf2, 0xf2])), 50);

    await expect(result1).resolves.toEqual('response1');
    await expect(result2).resolves.toEqual('response2');
    expect(spy1).toHaveBeenCalledWith(new ReadBuffer(Buffer.from([0xf1])));
    expect(spy2).toHaveBeenCalledWith(new ReadBuffer(Buffer.from([0xf2, 0xf2])));

    expect(clientSocket.dataSent).toEqual(Buffer.from([0x00, 0x00, 0x00, 0x01, 0xfa, 0x00, 0x00, 0x00, 0x01, 0xfb]));
  });

  it("should throw an error if response correlationId doesn't match", async () => {
    const request = new RequestMock(10)
      .withDeserializeHeader({ correlationId: new Int32(50) } as RequestHeader)
      .withDeserializeData({});
    const result = connection.send(request.mock);

    setImmediate(() => clientSocket.emit('data', Buffer.from([0x00, 0x00, 0x00, 0x01, 0xf1])));

    await expect(result).rejects.toThrow('Received response with unexpected correlation ID');
  });
});

class MockedSocket extends Socket {
  public dataSent: Buffer = Buffer.alloc(0);

  public override write(data: Uint8Array | string): boolean {
    this.dataSent = Buffer.concat([this.dataSent, Buffer.from(data)]);

    return true;
  }
}

class RequestMock {
  public readonly mock: DeepMocked<Request<any>>;

  constructor(private readonly correlationId: number = 0) {
    this.mock = createMock<Request<any>>({ header: { correlationId: new Int32(this.correlationId) } });
    this.withDeserializeHeader();
    this.withDeserializeData();
  }

  public withSerialize(toSerialize?: Buffer): this {
    this.mock.serialize.mockImplementation(async (buffer) => {
      if (toSerialize !== undefined) {
        buffer.writeBuffer(toSerialize);
      }
    });

    return this;
  }

  public withDeserializeHeader(header?: RequestHeader): this {
    this.mock.ExpectedResponseHeaderClass.deserialize = jest
      .fn()
      .mockReturnValue(header ?? { correlationId: new Int32(this.correlationId) });

    return this;
  }

  public withDeserializeData(data?: any): this {
    this.mock.ExpectedResponseDataClass.deserialize = jest.fn().mockReturnValue(data);

    return this;
  }
}
