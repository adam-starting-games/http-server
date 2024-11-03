const { exists, readFile } = require("fs");

function existsAsync(path) {
  return new Promise((resolve) => {
    exists(path, resolve);
  });
}

function readFileAsync(path, encoding = "utf-8") {
  return new Promise((resolve, reject) => {
    readFile(path, encoding, (error, data) => {
      if (error) {
        reject(error);
      }

      resolve(data);
    });
  });
}

module.exports = { existsAsync, readFileAsync };
