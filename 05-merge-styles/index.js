const path = require("path");
const fs = require("fs");
const { readdir } = require("fs/promises");

const projectFolder = path.resolve(__dirname, "project-dist", "bundle.css");
const stylesFolder = path.resolve(__dirname, "styles");

async function createBundleCSS() {
  try {
    const bundle = fs.createWriteStream(projectFolder);
    let files = await readdir(stylesFolder, { withFileTypes: true });
    for (let file of files) {
      const filePath = path.resolve(stylesFolder, file.name);
      const readStream = fs.createReadStream(filePath, "utf-8");
      if (file.isFile() && path.extname(filePath) === ".css")
        readStream.on("data", (chunk) => bundle.write(chunk + "\n"));
    }
    console.log("Bundle is completed");
  } catch (err) {
    console.log(err);
  }
}

createBundleCSS();
