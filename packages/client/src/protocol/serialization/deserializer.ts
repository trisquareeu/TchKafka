import { type ReadBuffer } from './read-buffer';

export type Deserializer<T> = (buffer: ReadBuffer) => T;
