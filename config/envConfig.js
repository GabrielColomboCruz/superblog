// config/envConfig.js

const envConfig = {};

Object.keys(process.env).forEach((key) => {
  if (typeof process.env[key] === "string") {
    envConfig[key] = process.env[key];
  }
});

module.exports = () => envConfig;
