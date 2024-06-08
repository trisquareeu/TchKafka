export type SupportedApiVersions = {
  [apiKey: number]: {
    min: number;
    max: number;
  };
};
