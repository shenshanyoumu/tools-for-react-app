process.on('unhandledRejection', err => {
  throw err;
});

const updateIntlFromAPI = require('../utils/updateIntlFromAPI');

updateIntlFromAPI();
