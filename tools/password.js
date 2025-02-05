const crypto = require('crypto');

const encryptionPassword = async (password) => {
  const hmac = crypto.createHmac('sha256', 'ignition-test');
  hmac.update(password);
  return hmac.digest('hex');
};

console.log(encryptionPassword('123456'));
