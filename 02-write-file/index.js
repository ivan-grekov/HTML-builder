const path = require("path");
const fs = require("fs");
const { stdin, stdout } = require("process");

const textFile = path.join(__dirname, "text.txt");
const output = fs.createWriteStream(textFile);

stdout.write("Hi! Enter your text.\n");

stdin.on("data", (data) => {
  data.toString().trim() === "exit" ? process.exit() : output.write(data);
  stdout.write(`${data.toString().trim()} was added!\n`);
  process.exit();
});

process.on("exit", () => stdout.write("Have a nice day!\n"));
process.on("SIGINT", () => process.exit());
