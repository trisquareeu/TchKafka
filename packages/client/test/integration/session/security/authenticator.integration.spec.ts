import { KafkaContainer } from '@testcontainers/kafka';
import { readFileSync } from 'fs';
import { GenericContainer, type StartedTestContainer } from 'testcontainers';
import { join } from 'path';
import {
  Connection,
  SaslAuthenticator,
  ScramSha256,
  ScramCredentials,
  ScramSha512,
  PlainSaslMechanism
} from '../../../../src/session';
import { KafkaContainerUtils } from '../../utils/kafka-container-utils';

jest.setTimeout(120_000);

describe('Authenticator', () => {
  let container: StartedTestContainer;
  let kafkaContainerUtils: KafkaContainerUtils;

  describe('SaslAuthenticator', () => {
    describe('SCRAM-SHA-256', () => {
      beforeAll(async () => {
        container = await new KafkaContainer('confluentinc/cp-kafka:7.3.2')
          .withExposedPorts(9092, 9095)
          .withSaslSslListener({
            keystore: {
              content: readFileSync(join(__dirname, './certs/kafka.keystore.jks')),
              passphrase: 'changeit'
            },
            sasl: {
              mechanism: 'SCRAM-SHA-256',
              user: {
                name: 'user',
                password: 'password'
              }
            },
            port: 9095
          })
          .start();
        kafkaContainerUtils = new KafkaContainerUtils(container);
      });

      afterAll(async () => {
        await container.stop();
      });

      it('should authorize', async () => {
        const socket = await kafkaContainerUtils.getTlsConnectedSocket(9095);
        const connection = new Connection(socket);
        const authenticator = new SaslAuthenticator(
          new ScramSha256(new ScramCredentials(Buffer.from('user'), Buffer.from('password'))),
          'tchkafka',
          'tchkafka',
          '1.0.0'
        );

        await authenticator.authenticate(connection);

        expect(socket.writable).toBe(true);
        expect(socket.readable).toBe(true);
      });
    });

    describe('SCRAM-SHA-512', () => {
      beforeAll(async () => {
        container = await new KafkaContainer('confluentinc/cp-kafka:7.3.2')
          .withExposedPorts(9092, 9095)
          .withSaslSslListener({
            keystore: {
              content: readFileSync(join(__dirname, './certs/kafka.keystore.jks')),
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
          .start();
        kafkaContainerUtils = new KafkaContainerUtils(container);
      });

      afterAll(async () => {
        await container.stop();
      });

      it('should authorize', async () => {
        const socket = await kafkaContainerUtils.getTlsConnectedSocket(9095);
        const connection = new Connection(socket);
        const authenticator = new SaslAuthenticator(
          new ScramSha512(new ScramCredentials(Buffer.from('user'), Buffer.from('password'))),
          'tchkafka',
          'tchkafka',
          '1.0.0'
        );

        await authenticator.authenticate(connection);

        expect(socket.writable).toBe(true);
        expect(socket.readable).toBe(true);
      });
    });

    describe('PLAIN', () => {
      beforeAll(async () => {
        container = await new GenericContainer('confluentinc/cp-kafka:latest')
          .withExposedPorts(9094)
          .withBindMounts([
            {
              source: join(__dirname, './kafka_server_jaas.conf'),
              target: '/etc/kafka/kafka_server_jaas.conf'
            }
          ])
          .withEnvironment({
            KAFKA_NODE_ID: '1',
            KAFKA_CONTROLLER_LISTENER_NAMES: 'CONTROLLER',
            KAFKA_OPTS: '-Djava.security.auth.login.config=/etc/kafka/kafka_server_jaas.conf',
            KAFKA_LISTENER_SECURITY_PROTOCOL_MAP:
              'CONTROLLER:PLAINTEXT,INTERNAL:PLAINTEXT,SASL_PLAINTEXT:SASL_PLAINTEXT',
            KAFKA_LISTENERS: 'INTERNAL://localhost:29092,SASL_PLAINTEXT://0.0.0.0:9094,CONTROLLER://localhost:29093',
            KAFKA_ADVERTISED_LISTENERS: 'INTERNAL://localhost:29092,SASL_PLAINTEXT://127.0.0.1:9094',
            KAFKA_INTER_BROKER_LISTENER_NAME: 'INTERNAL',
            KAFKA_CONTROLLER_QUORUM_VOTERS: '1@localhost:29093',
            KAFKA_PROCESS_ROLES: 'broker,controller',
            KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: '0',
            KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: '1',
            KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: '1',
            CLUSTER_ID: 'ciWo7IWazngRchmPES6q5A==',
            KAFKA_SASL_ENABLED_MECHANISMS: 'PLAIN',
            KAFKA_SASL_MECHANISM_INTER_BROKER_PROTOCOL: 'PLAIN',
            KAFKA_SASL_JAAS_CONFIG:
              'org.apache.kafka.common.security.plain.PlainLoginModule required username="admin" password="admin-secret"'
          })
          .start();
        kafkaContainerUtils = new KafkaContainerUtils(container);
      });

      afterAll(async () => {
        await container.stop();
      });

      it('should authorize', async () => {
        const socket = await kafkaContainerUtils.getConnectedSocket(9094);
        const connection = new Connection(socket);
        const authenticator = new SaslAuthenticator(
          new PlainSaslMechanism('admin', 'admin-secret'),
          'tchkafka',
          'tchkafka',
          '1.0.0'
        );

        await authenticator.authenticate(connection);

        expect(socket.writable).toBe(true);
        expect(socket.readable).toBe(true);
      });
    });
  });
});
