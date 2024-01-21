import Mitm from 'mitm';
import Net from 'net';
import { TagSection } from '../../../protocol/commons';
import { CorrelationIdMismatchError } from '../../../protocol/exceptions';
import { Int16, Int32, NullableString, String } from '../../../protocol/primitives';
import { type Request, RequestHeaderV2 } from '../../../protocol/requests';
import { ResponseHeaderV0 } from '../../../protocol/responses';
import { type ReadBuffer, type Serializable, WriteBuffer } from '../../../protocol/serialization';
import { Connection } from './connection';

describe('connection', () => {
  let mitm: ReturnType<typeof Mitm>;
  let serverSocket: Net.Socket;
  let connection: Connection;

  beforeEach(async () => {
    mitm = Mitm();

    const serverSocketPromise = new Promise<Net.Socket>((resolve) => {
      mitm.on('connection', (socket: Net.Socket) => {
        resolve(socket);
      });
    });

    const clientSocket = Net.connect(22, 'example.org');
    connection = new Connection(clientSocket);
    serverSocket = await serverSocketPromise;
  });

  it('should resolve promises in correct order', async () => {
    const expectedString1 = new String('String 1');
    const expectedString2 = new String('String 2');
    const testRequest1 = new TestRequestV1337(
      new RequestHeaderV2(new Int16(99), new Int16(1337), new NullableString('client'), new TagSection()),
      expectedString1
    );
    const sentData1 = connection.send(testRequest1);
    const testRequest2 = new TestRequestV1337(
      new RequestHeaderV2(new Int16(99), new Int16(1337), new NullableString('client'), new TagSection()),
      expectedString2
    );
    const sentData2 = connection.send(testRequest2);

    serverSocket.write(await createResponseMessage(expectedString1, testRequest1.header.correlationId.value));
    serverSocket.write(await createResponseMessage(expectedString2, testRequest2.header.correlationId.value));

    const receivedData1 = await sentData1;
    const receivedData2 = await sentData2;

    expect(receivedData1).toBeInstanceOf(TestResponseData);
    expect(receivedData1.test.value).toEqual(expectedString1.value);
    expect(receivedData2).toBeInstanceOf(TestResponseData);
    expect(receivedData2.test.value).toEqual(expectedString2.value);
  });

  it('should throw if there is correlationId mismatch', async () => {
    const expectedString = new String('String 1');
    const testRequest = new TestRequestV1337(
      new RequestHeaderV2(new Int16(99), new Int16(1337), new NullableString('client'), new TagSection()),
      expectedString
    );
    const sentData = connection.send(testRequest);

    serverSocket.write(await createResponseMessage(expectedString, testRequest.header.correlationId.value + 1));

    await expect(sentData).rejects.toThrowError(CorrelationIdMismatchError);
  });

  it('should receive full response', async () => {
    const expectedString = new String("I'll be blazingly fast!");
    const testRequest = new TestRequestV1337(
      new RequestHeaderV2(new Int16(99), new Int16(1337), new NullableString('client'), new TagSection()),
      expectedString
    );
    const sentData = connection.send(testRequest);

    serverSocket.write(await createResponseMessage(expectedString, testRequest.header.correlationId.value));

    const receivedData = await sentData;

    expect(receivedData).toBeInstanceOf(TestResponseData);
    expect(receivedData.test.value).toEqual(expectedString.value);
  });
});

async function createResponseMessage(data: Serializable, id: number): Promise<Buffer> {
  const wb = new WriteBuffer();
  await data.serialize(wb);
  const dataBuffer = wb.toBuffer();

  const length = new Int32(dataBuffer.length + 4);
  const correlationId = new Int32(id);

  const buffer = new WriteBuffer();

  await length.serialize(buffer);
  await correlationId.serialize(buffer);
  buffer.writeBuffer(dataBuffer);

  return buffer.toBuffer();
}

class TestResponseData {
  constructor(public readonly test: String) {}

  public static deserialize(buffer: ReadBuffer): TestResponseData {
    return new TestResponseData(String.deserialize(buffer));
  }
}

class TestRequestV1337 implements Request<TestResponseData> {
  public readonly ExpectedResponseDataClass = TestResponseData;
  public readonly ExpectedResponseHeaderClass = ResponseHeaderV0;

  constructor(
    public readonly header: RequestHeaderV2,
    public readonly test: String
  ) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.header.serialize(buffer);
    await this.test.serialize(buffer);
  }
}
