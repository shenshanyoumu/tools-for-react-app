process.on('unhandledRejection', err => {
  throw err;
});

const uploadIntl = require('../utils/uploadIntl');

uploadIntl();
