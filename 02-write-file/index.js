const path = require("path");
const fs = require("fs");
const { stdin, stdout } = require("process");
const ReadLine = require("readline");

const textFile = path.join(__dirname, "text.txt");

stdout.write("Hi! Enter your text.\n");

const output = fs.createWriteStream(textFile);

stdin.on("data", (data) => {
  data.toString().trim() === "exit" ? process.exit() : output.write(data);
  stdout.write(`${data.toString().trim()} was added!\n`);
});

process.on("exit", () => stdout.write("Have a nice day!\n"));
process.on("SIGINT", () => process.exit());
