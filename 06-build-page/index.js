const path = require("path");
const fs = require("fs");
const { mkdir, rm, readdir, copyFile, readFile } = require("fs/promises");

const createdFolderOfProject = path.resolve(__dirname, "project-dist");
const stylesFolder = path.resolve(__dirname, "styles");
const stylesFile = path.resolve(__dirname, "project-dist", "style.css");
const assetsFolder = path.resolve(__dirname, "assets");
const copiedAssets = path.resolve(__dirname, "project-dist", "assets");

async function createPage() {
  await rm(createdFolderOfProject, { recursive: true, force: true });
  await mkdir(createdFolderOfProject, { recursive: true });
  await copyAssets(assetsFolder, copiedAssets);
  await createBundle();
  await createMarkup();
}

// copy of assets

async function copyAssets(initFolder, copiedFolder) {
  await mkdir(copiedFolder, { recursive: true });
  try {
    const files = await readdir(initFolder, { withFileTypes: true });
    for (let file of files) {
      if (file.isFile()) {
        await copyFile(
          path.resolve(initFolder, file.name),
          path.resolve(copiedFolder, file.name)
        );
      } else if (!file.isFile()) {
        await mkdir(path.resolve(copiedFolder, file.name), { recursive: true });
        await copyAssets(
          path.resolve(initFolder, file.name),
          path.resolve(copiedFolder, file.name)
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
}

// copy of styles

async function createBundle() {
  try {
    const bundle = fs.createWriteStream(stylesFile);
    let files = await readdir(stylesFolder, { withFileTypes: true });
    for (let file of files) {
      const filePath = path.resolve(stylesFolder, file.name);
      const readStream = fs.createReadStream(filePath, "utf-8");
      if (file.isFile() && path.extname(filePath) === ".css")
        readStream.on("data", (chunk) => bundle.write(chunk + "\n"));
    }
  } catch (error) {
    console.log(error);
  }
}

// create of murkup

async function createMarkup() {
  try {
    const createdMurkup = path.resolve(createdFolderOfProject, "index.html");
    const componentsFolder = path.resolve(__dirname, "components");
    const readStream = fs.createReadStream(
      path.resolve(__dirname, "template.html"),
      "utf-8"
    );
    const writeStream = fs.createWriteStream(createdMurkup, "utf-8");
    readStream.on("data", async (chunk) => {
      async function replaceHtml() {
        let files = await readdir(componentsFolder, { withFileTypes: true });
        let data = "";
        data += chunk.toString();
        for (let file of files) {
          let componentFile = path.resolve(componentsFolder, file.name);
          let name = file.name.split(".");
          const component = await readFile(componentFile, "utf-8");
          data = data.replace(`{{${name[0]}}}`, `${component}`);
        }
        return data;
      }
      let newHtmlContent = await replaceHtml();
      writeStream.write(newHtmlContent);
    });
    console.log("Page is created");
  } catch (error) {
    console.log(error);
  }
}

createPage();
