import type { WriteBuffer } from './write-buffer';

export interface Serializable {
  serialize(buffer: WriteBuffer): Promise<void>;
}
