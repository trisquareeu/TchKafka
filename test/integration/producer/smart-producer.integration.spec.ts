import { KafkaContainer, type StartedKafkaContainer } from '@testcontainers/kafka';
import { SmartProducer, StringSerializer } from '../../../src/producer';
import { type SimpleTopic } from '../../../src/protocol/requests';
import { KafkaContainerUtils } from '../utils/kafka-container-utils';
import { randomUUID } from 'crypto';

jest.setTimeout(120_000);

const port = 9093;

describe('SmartProducer', () => {
  let container: StartedKafkaContainer;
  let kafkaContainerUtils: KafkaContainerUtils;
  let topic: SimpleTopic;

  beforeAll(async () => {
    container = await new KafkaContainer().withExposedPorts(port).start();
    kafkaContainerUtils = new KafkaContainerUtils(container);
  });

  afterAll(async () => {
    await container.stop();
  });

  beforeEach(async () => {
    topic = { name: `topic-${randomUUID()}` };
    await kafkaContainerUtils.createTopic(topic.name);
  });

  it('should send the request and properly parse the response', async () => {
    const producer = new SmartProducer(
      [
        {
          host: container.getHost(),
          port: container.getMappedPort(port)
        }
      ],
      {
        acks: -1
      },
      new StringSerializer(),
      new StringSerializer()
    );

    const response = await producer.send({
      headers: { a: 'one', b: ['two', 'three'] },
      key: 'hey',
      value: 'somevalue',
      topic: topic.name
    });
    await producer.send({
      headers: { a: 'one', b: ['two', 'three'] },
      key: 'hey',
      value: 'somevalue',
      topic: topic.name
    });
    await producer.send({
      headers: { a: 'one', b: ['two', 'three'] },
      key: 'hey',
      value: 'somevalue',
      topic: topic.name
    });

    expect(response).toBeDefined();
  });
});
