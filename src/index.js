const fs = require("fs");
const path = require("path");
const { main } = require("./parser.js").default;

const resolve = dir => path.join(__dirname, "..", dir);

const out = main();

fs.writeFileSync(resolve("out.csv"), out, 'utf16le');