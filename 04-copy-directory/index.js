const path = require("path");
const { mkdir, readdir, rm, copyFile } = require("fs/promises");
const initFolder = path.join(__dirname, "files");
const copiedFolder = path.join(__dirname, "copy-of-files");

async function copyFolder() {
  await rm(copiedFolder, { recursive: true, force: true });
  await mkdir(copiedFolder, { recursive: true });

  try {
    let files = await readdir(initFolder, { withFileTypes: true });
    for (let file of files) {
      await copyFile(
        path.join(initFolder, file.name),
        path.join(copiedFolder, file.name)
      );
    }
    console.log("Copy folder is created!");
  } catch (err) {
    console.error(err);
  }
}

copyFolder();
