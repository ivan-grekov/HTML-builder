const path = require("path");
const fs = require("fs");
const { stdout } = require("process");

const textFile = path.join(__dirname, "text.txt");
const readableStream = fs.createReadStream(textFile, "utf-8");
readableStream.on("data", (data) => stdout.write(data));
readableStream.on("error", (error) =>
  stdout.write("Something wrong with data\n", error.message)
);
