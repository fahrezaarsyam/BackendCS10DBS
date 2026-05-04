const { createClient } = require('redis');

const redisClient = createClient(
  process.env.REDIS_URL
    ? { url: process.env.REDIS_URL }
    : {
        socket: {
          host: process.env.REDIS_HOST || '127.0.0.1',
          port: process.env.REDIS_PORT || 6379,
        },
      }
);

redisClient.on('error', (err) => {
  console.error('Redis Error:', err);
});

redisClient.connect()
  .then(() => console.log('Redis connected successfully'))
  .catch(console.error);

module.exports = redisClient;