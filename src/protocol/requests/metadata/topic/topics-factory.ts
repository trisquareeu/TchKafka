import { type UUID } from 'crypto';
import { CompactNullableString, CompactString, String, Uuid } from '../../../primitives';
import { TopicV10 } from './topic-v10';
import { TopicV9 } from './topic-v9';

export type Topics = string[] | { id: UUID; name?: string }[];

export class TopicsFactory {
  constructor(private readonly topics: Topics) {}

  public createStrings(): String[] {
    if (this.isStringArray(this.topics)) {
      return this.topics.map((topic) => new String(topic));
    }

    if (this.topics.every((topic): topic is { name: string; id: UUID } => topic.name !== undefined)) {
      return this.topics.map((topic) => new String(topic.name));
    }

    throw new Error('Invalid topics');
  }

  public createTopicsV9(): TopicV9[] {
    if (this.isStringArray(this.topics)) {
      return this.topics.map((topic) => new TopicV9(new CompactString(topic)));
    }

    if (this.topics.every((topic): topic is { name: string; id: UUID } => topic.name !== undefined)) {
      return this.topics.map((topic) => new TopicV9(new CompactString(topic.name)));
    }

    throw new Error('Invalid topics');
  }

  public createTopicsV10(): TopicV10[] {
    if (this.isStringArray(this.topics)) {
      return this.topics.map((topic) => new TopicV10(Uuid.Zero, new CompactNullableString(topic)));
    }

    if (this.topics.every((topic): topic is { name: string; id: UUID } => topic.name !== undefined)) {
      return this.topics.map((topic) => new TopicV10(Uuid.Zero, new CompactNullableString(topic.name)));
    }

    throw new Error('Invalid topics');
  }

  public createTopicsV12(): TopicV10[] {
    if (this.isStringArray(this.topics)) {
      throw new Error('Invalid topics');
    }

    return this.topics.map((topic) => new TopicV10(Uuid.from(topic.id), new CompactNullableString(topic.name ?? null)));
  }

  private isStringArray(topics: string[] | { id: UUID; name?: string }[]): topics is string[] {
    return topics.every((topic) => typeof topic === 'string');
  }
}
