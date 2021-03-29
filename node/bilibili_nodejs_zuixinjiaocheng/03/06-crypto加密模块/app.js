const crypto = require('crypto');

const password = 'xcva';

crypto
  .createHash('sha1')
  .update(password)
  .digest('hex')