const MINIMUM_ITERATIONS = 4096;

/**
 * According to the Apache Kafka documentation 7.4.5.4 Security Considerations for SASL/SCRAM,
 * Kafka supports only the strong hash functions SHA-256 and SHA-512 with a minimum iteration
 * count of 4096.
 *
 * @see https://kafka.apache.org/documentation/#security_sasl_scram_security
 */
export type HashFunction = {
  readonly hashLengthInBytes: number;
  readonly minimumIterations: number;
  readonly digest: string;
};

export const Sha256: HashFunction = {
  hashLengthInBytes: 256 / 8,
  minimumIterations: MINIMUM_ITERATIONS,
  digest: 'sha256'
};

export const Sha512: HashFunction = {
  hashLengthInBytes: 512 / 8,
  minimumIterations: MINIMUM_ITERATIONS,
  digest: 'sha512'
};
