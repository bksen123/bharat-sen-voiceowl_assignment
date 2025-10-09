export const config = {
  port: 4000,
  mongoUri: 'mongodb://localhost:27017/voiceowl',
  downloadRetry: {
    attempts: 3,
    baseDelayMs: 300
  }
};