// Mock Redis client to bypass Railway resource limits
const redisClient = {
  on: (event, callback) => {},
  connect: () => Promise.resolve(),
  get: () => Promise.resolve(null),
  setEx: () => Promise.resolve(),
  del: () => Promise.resolve(),
  xAdd: () => Promise.resolve('mock-id'),
};

console.log('Redis mocked: App will run without a physical Redis service.');

module.exports = redisClient;