const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

function checkRequiredFiles(...files) {
  let currentFile;
  
  try {
    files.forEach(file => {
      currentFile = file;
      fs.accessSync(file, fs.F_OK);
    });
    return true;
  } catch (e) {
    console.log(chalk.red(`Couldn't find the requested file: ${currentFile}`));
    return false;
  }
}

module.exports = checkRequiredFiles;
