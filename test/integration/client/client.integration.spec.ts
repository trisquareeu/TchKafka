/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { KafkaContainer, type StartedKafkaContainer } from '@testcontainers/kafka';
import { readFileSync } from 'fs';
import { Connection } from '../../../src/connection/connection';
import { Int16, Int32, NullableString, String } from '../../../src/protocol/primitives';
import {
  ApiVersionsRequestV0,
  RequestHeaderV1,
  SaslHandshakeRequestV1,
  SaslAuthenticateRequestBuilder
} from '../../../src/protocol/requests';
import { KafkaBrokerUtils } from '../../utils/kafka-broker-utils';
import { createHash, createHmac, randomBytes } from 'crypto';

jest.setTimeout(60000);

const URLSAFE_BASE64_PLUS_REGEX = /\+/g;
const URLSAFE_BASE64_SLASH_REGEX = /\//g;
const URLSAFE_BASE64_TRAILING_EQUAL_REGEX = /=+$/;

describe('Client', () => {
  let container: StartedKafkaContainer;
  let kafkaUtils: KafkaBrokerUtils;

  beforeAll(async () => {
    container = await new KafkaContainer('confluentinc/cp-kafka:7.3.2')
      .withExposedPorts(9092, 9095)
      .withSaslSslListener({
        keystore: {
          content: readFileSync('/Users/kai3wz/projects/work/kafkit/test/certs/keystore/kafka.keystore.jks'),
          passphrase: 'changeit'
        },
        sasl: {
          mechanism: 'SCRAM-SHA-512',
          user: {
            name: 'user',
            password: 'password'
          }
        },
        port: 9095
      })
      .withReuse()
      .start();

    kafkaUtils = new KafkaBrokerUtils(container);
  });

  afterAll(async () => {
    await container.stop();
  });

  it('should send a SaslAuthenticateRequest with the correct gs2Header', async () => {
    const connectedSocket = await kafkaUtils.getTlsConnectedSocket(9095);
    expect(connectedSocket).toBeDefined();
    expect(connectedSocket.writable).toBeTruthy();
    const connection = new Connection(connectedSocket);
    const request = new ApiVersionsRequestV0(
      new RequestHeaderV1(new Int16(18), new Int16(0), new Int32(5), new NullableString('test'))
    );

    const response = await connection.send(request);
    expect(response).toBeInstanceOf(request.ExpectedResponseDataClass);

    const handshakeRequest = new SaslHandshakeRequestV1(
      new RequestHeaderV1(new Int16(17), new Int16(1), new Int32(5), new NullableString('test')),
      new String('SCRAM-SHA-512')
    );

    const handshakeResponse = await connection.send(handshakeRequest);
    expect(handshakeResponse).toBeInstanceOf(handshakeRequest.ExpectedResponseDataClass);

    const username = 'user';
    const nonce = randomBytes(16)
      .toString('base64')
      .replace(URLSAFE_BASE64_PLUS_REGEX, '-') // make it url safe
      .replace(URLSAFE_BASE64_SLASH_REGEX, '_')
      .replace(URLSAFE_BASE64_TRAILING_EQUAL_REGEX, '');
    const gs2Header = 'n,,';
    const clientId = null;

    const authenticate = await connection.send(
      new SaslAuthenticateRequestBuilder(Buffer.from(`${gs2Header}n=${username},r=${nonce}`), clientId).build(5, 1, 1)
    );
    expect(authenticate).toBeDefined();

    const parsedResponse = parseScramFirstResponse(authenticate.authBytes.value.toString());
    expect(parsedResponse.r).toBeDefined();
    expect(parsedResponse.s).toBeDefined();
    expect(parsedResponse.i).toBeDefined();

    const clientKey = HMAC_SHA512('password', parsedResponse.s);

    const storedKey = H(clientKey);
  });
});

const HMAC_SHA512 = (key: string, data: string) => {
  return createHmac('sha512', key).update(data).digest();
};

const parseScramFirstResponse = (response: string): Record<any, string> => {
  const params = response.split(',');
  const parsedParams: { [key: string]: string } = {};
  for (const param of params) {
    const [key, value] = param.split('=');
    parsedParams[key] = value;
  }

  return parsedParams;
};

const H = (data: Buffer) => {
  return createHash('sha512').update(data).digest();
};
