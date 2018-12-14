const _ = require('lodash');
const chalk = require('chalk');
const paths = require('../../config/paths');

module.exports = (resolve, rootDir) => {
  const __DEV__ = process.env.NODE_ENV === 'development';
  const __PROD__ = process.env.NODE_ENV === 'production';
  const __TEST__ = process.env.NODE_ENV === 'test';
  const __SERVER__ = process.env.BABEL_ENV === 'server';
  const __CLIENT__ = !__SERVER__;
  const __HOST__ = process.env.HOST || 'localhost';
  const __PORT__ = process.env.PORT || 80;
  const __HOST_API__ = process.env.HOST_API || 'http://localhost:4000';
  const __HOST_CDN__ = process.env.HOST_CDN || 'http://localhost:80';

  const config = {
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.{js,jsx}'],
    coverageDirectory: 'coverage',
    coverageReporters: ['html', 'text'],
    moduleDirectories: ['node_modules', 'src', 'test', 'mock'],
    moduleFileExtensions: ['web.js', 'js', 'json', 'web.jsx', 'jsx', 'node'],
    setupFiles: [resolve('utils/jest/setupFiles.js')],
    testEnvironment: 'node',
    moduleNameMapper: {
      '^react-native$': 'react-native-web',
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': resolve(
        'utils/jest/__mocks__/fileMock.js'
      ),
      '\\.(css|less)$': resolve('utils/jest/__mocks__/styleMock.js'),
    },
    verbose: true,
    timers: 'fake',
    globals: {
      __DEV__: JSON.stringify(__DEV__),
      __PROD__: JSON.stringify(__PROD__),
      __TEST__: JSON.stringify(__TEST__),
      __SERVER__: JSON.stringify(__SERVER__),
      __CLIENT__: JSON.stringify(__CLIENT__),
      __HOST__: JSON.stringify(__HOST__),
      __PORT__: JSON.stringify(__PORT__),
      __HOST_API__: JSON.stringify(__HOST_API__),
      __HOST_CDN__: JSON.stringify(__HOST_CDN__),
    },
  };

  if (rootDir) {
    config.rootDir = rootDir;
  }

  const overrides = Object.assign({}, require(paths.packageJson).jest);
  const supportedKeys = [
    'collectCoverageFrom',
    'coverageReporters',
    'coverageThreshold',
    'snapshotSerializers',
    'moduleDirectories',
    'moduleFileExtensions',
    'setupFiles',
    'moduleNameMapper',
    'globals',
  ];

  if (overrides) {
    supportedKeys.forEach(key => {
      if (overrides.hasOwnProperty(key)) {
        if (_.isArray(config[key])) {
          config[key] = config[key].concat(overrides[key]);
        } else if (_.isObject(config[key])) {
          config[key] = Object.assign(config[key], overrides[key]);
        } else {
          config[key] = overrides[key];
        }

        delete overrides[key];
      }
    });

    const unsupportedKeys = Object.keys(overrides);

    if (unsupportedKeys.length) {
      console.error(
        chalk.red(
          'Out of the box, Create React App only supports overriding ' +
            'these Jest options:\n\n' +
            supportedKeys.map(key => chalk.bold('  \u2022 ' + key)).join('\n') +
            '.\n\n' +
            'These options in your package.json Jest configuration ' +
            'are not currently supported by Create React App:\n\n' +
            unsupportedKeys
              .map(key => chalk.bold('  \u2022 ' + key))
              .join('\n') +
            '\n\nIf you wish to override other Jest options, you need to ' +
            'eject from the default setup. You can do so by running ' +
            chalk.bold('npm run eject') +
            ' but remember that this is a one-way operation. ' +
            'You may also file an issue with Create React App to discuss ' +
            'supporting more options out of the box.\n'
        )
      );
      process.exit(1);
    }
  }

  return config;
};
