export const getEnv = () => {
  if (location.hostname.includes('localhost')) {
    return 'dev';
  } else if (location.hostname.includes('test')) {
    return 'test';
  } else {
    return 'prod';
  }
};
