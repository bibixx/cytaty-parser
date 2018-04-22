const fs = require("fs");
const rimraf = require("rimraf");
const path = require("path");
const resolve = dir => path.join(__dirname, "..", dir);

const fileName = resolve("out.csv");

rimraf.sync(fileName);

require("./index.js");

let wasError = false;

try {
  const encoding = "utf16le";
  csvFile = fs.readFileSync(fileName, encoding);
} catch (e) {
  wasError = true;
}

describe("File creation", () => {
  test("It creates file", () => {
    expect(wasError).toBe(false);
  });
} );