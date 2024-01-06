/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { KafkaContainer, type StartedKafkaContainer } from '@testcontainers/kafka';
import { readFileSync } from 'fs';
import { Connection } from '../../../src/connection/connection';
import { Int16, Int32, NullableString, String } from '../../../src/protocol/primitives';
import {
  ApiVersionsRequestV0,
  MetadataRequestBuilder,
  RequestHeaderV1,
  SaslAuthenticateRequestBuilder,
  SaslHandshakeRequestV1
} from '../../../src/protocol/requests';
import { KafkaBrokerUtils } from '../../utils/kafka-broker-utils';
import { BinaryLike, createHash, createHmac, pbkdf2, randomBytes } from 'crypto';

jest.setTimeout(60000);

const GS2_HEADER = 'n,,';
const EQUAL_SIGN_REGEX = /=/g;
const COMMA_SIGN_REGEX = /,/g;
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
          content: readFileSync('./test/certs/keystore/kafka.keystore.jks'),
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

    const clientId = 'test';
    const handshakeRequest = new SaslHandshakeRequestV1(
      new RequestHeaderV1(new Int16(17), new Int16(1), new Int32(5), new NullableString(clientId)),
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

    const encodedUsername = username.replace(EQUAL_SIGN_REGEX, '=3D').replace(COMMA_SIGN_REGEX, '=2C');
    const firstMessageBare = `n=${encodedUsername},r=${nonce}`;
    const clientFirstMessage = `${GS2_HEADER}${firstMessageBare}`;

    const authenticate = await connection.send(
      new SaslAuthenticateRequestBuilder(Buffer.from(clientFirstMessage), clientId).build(5, 1, 1)
    );
    expect(authenticate).toBeDefined();

    const parsedResponse = parseScramFirstResponse(authenticate.authBytes.value.toString());
    expect(parsedResponse.r).toBeDefined();
    expect(parsedResponse.r).toMatch(new RegExp(`^${nonce}?`));
    expect(parsedResponse.s).toBeDefined();
    expect(parsedResponse.i).toBeDefined();

    const finalMessageWithoutProof = `c=${Buffer.from(GS2_HEADER).toString('base64')},r=${parsedResponse.r}`;

    const password = 'password';
    const encodedPassword = Buffer.from(password).toString('utf-8');
    const salt = Buffer.from(parsedResponse.s!, 'base64');
    const iterations = parseInt(parsedResponse.i!, 10);
    expect(iterations).toBeGreaterThanOrEqual(4096);

    const saltedPassword = await hi(encodedPassword, salt, iterations);
    const clientKey = HMAC_SHA512(saltedPassword, 'Client Key');
    const storedKey = createHash('sha512').update(clientKey).digest();
    const clientSignature = HMAC_SHA512(
      storedKey,
      `${firstMessageBare},${authenticate.authBytes.value.toString()},${finalMessageWithoutProof}`
    );
    const clientProof = Buffer.from(xor(clientKey, clientSignature)).toString('base64');
    const clientFinalMessage = `${finalMessageWithoutProof},p=${clientProof}`;

    console.log(clientFinalMessage);

    const finalClientMessageResponse = await connection.send(
      new SaslAuthenticateRequestBuilder(Buffer.from(clientFinalMessage), clientId).build(6, 1, 1)
    );
    expect(finalClientMessageResponse).toBeDefined();

    const metadataResponse = await connection.send(new MetadataRequestBuilder(clientId, []).build(7, 0));
    expect(metadataResponse).toBeDefined();
  });
});

/**
 * Hi() is, essentially, PBKDF2 [RFC2898] with HMAC() as the
 * pseudorandom function (PRF) and with dkLen == output length of
 * HMAC() == output length of H()
 *
 * @returns {Promise<Buffer>}
 */
const hi = async (password: BinaryLike, salt: BinaryLike, iterations: number): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    pbkdf2(password, salt, iterations, 64, 'sha512', (err, derivedKey) => (err ? reject(err) : resolve(derivedKey)));
  });
};

const HMAC_SHA512 = (key: BinaryLike, data: string) => {
  return createHmac('sha512', key).update(data).digest();
};

const xor = (bufferA: Buffer, bufferB: Buffer) => {
  if (Buffer.byteLength(bufferB) !== Buffer.byteLength(bufferB)) {
    throw new Error();
  }

  const result = [];
  for (let i = 0; i < Buffer.byteLength(bufferA); i++) {
    result.push(bufferA[i]! ^ bufferB[i]!);
  }

  return Buffer.from(result);
};

const parseScramFirstResponse = (response: string): Record<string, string> => {
  const params = response.split(',');
  const parsedParams: Record<string, string> = {};

  for (const param of params) {
    const [key, ...rest] = param.split('=');
    const value = rest.join('=');

    if (key && value) {
      parsedParams[key] = value;
    }
  }

  return parsedParams;
};
