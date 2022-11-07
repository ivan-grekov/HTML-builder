const path = require("path");
const fs = require("fs");
const { stdout } = require("process");

const dirPath = path.join(__dirname, "secret-folder");

fs.readdir(dirPath, { withFileTypes: true }, (error, files) => {
  if (error) throw error;
  files.forEach((file) => {
    if (file.isFile()) {
      fs.stat(path.join(dirPath, file.name), (error, stat) => {
        if (error) throw error;
        stdout.write(
          `${file.name.split(".")[0]} - ${path
            .extname(path.join(dirPath, file.name))
            .slice(1)} - ${stat.size}B\n`
        );
      });
    }
  });
});
