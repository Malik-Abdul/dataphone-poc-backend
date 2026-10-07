export const THROTTLE_VALUES = {
  DEFAULT: {
    limit: 10,
    ttl: 60_000,
  },

  AUTH: {
    limit: 20,
    ttl: 60_000,
  },

  UPLOAD: {
    limit: 20,
    ttl: 60_000,
  },
} as const;
