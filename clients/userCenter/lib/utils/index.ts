export const getEnv = () => {
  if (
    typeof window !== 'undefined' &&
    window.location.hostname.includes('localhost')
  ) {
    return 'dev';
  } else if (
    typeof window !== 'undefined' &&
    window.location.hostname.includes('test')
  ) {
    return 'test';
  } else {
    return 'prod';
  }
};
