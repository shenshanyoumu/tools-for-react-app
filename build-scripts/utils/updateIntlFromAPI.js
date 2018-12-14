const path = require("path");
const chalk = require("chalk");
const fs = require("fs-extra");
const glob = require("glob");
const fetch = require("isomorphic-fetch");

const HOST_APIS = {};
const defaultLocales = ["zh-CN", "en-US"];

const ROOT = process.cwd();
const customLocales = process.env.LOCALES ? process.env.LOCALES.split("|") : [];
const locales = [...defaultLocales, ...customLocales];
const serviceName = process.env.SERVICE_NAME;
const serviceEnv = process.env.SERVICE_ENV;
const HOST_API = HOST_APIS[serviceEnv];

if (!serviceName) {
  console.error(chalk.red(`Error: You project name is required`));
  process.exit(1);
}

if (!HOST_API) {
  console.error(chalk.red(`Error: 'SERVICE_ENV' is not found.`));
  process.exit(1);
}

function fetchIntl({ service, source, languageCode }) {
  const params = `?service=${service}&source=${source}&languageCode=${languageCode}`;

  return fetch(`${HOST_API}/internation/api/transfers/all${params}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .catch(err => {
      throw new Error(err);
    });
}

function createIntlFromAPI() {
  locales.forEach(locale => {
    const LANG_PATTERN = `${ROOT}/public/lang/${locale}/**/*.json`;

    glob.sync(LANG_PATTERN).forEach(filename => {
      const fileBasename = path.basename(filename, ".json");
      const fileContent = fs.readFileSync(filename, "utf8");

      fetchIntl({
        service: serviceName,
        source: fileBasename,
        languageCode: locale.replace("-", "_")
      }).then(res => {
        const newData = {};
        res.body.data.map(item => {
          newData[item.key] = item.value;
        });

        let oldData;
        try {
          oldData = JSON.parse(fileContent);
        } catch (err) {
          oldData = {};
        }

        const result = Object.assign({}, oldData, newData);

        // console.log(
        //   chalk.yellow(
        //     `${locale} ${fileBasename}.json old lang ==========> \n${fileContent}\n`
        //   )
        // );

        // console.log(
        //   chalk.green(
        //     `${locale} ${fileBasename}.json new lang ==========> \n${JSON.stringify(
        //       result
        //     )}\n\n`
        //   )
        // );

        fs.writeFileSync(filename, JSON.stringify(result, null, 2));
      });
    });
  });
}

module.exports = createIntlFromAPI;
