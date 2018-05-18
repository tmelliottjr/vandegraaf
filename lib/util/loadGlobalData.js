"use strict";

const fse = require("fs-extra");
const path = require("path");
const chalk = require("chalk");

const projectPaths = require("../util/loadPaths");

const publicPath = path.join(process.cwd(), projectPaths.public);
const srcPath = path.join(process.cwd(), projectPaths.src);

function getGlobalData() {
  const globalData = {};
  const dataDir = path.join(srcPath, "data");

  if (fse.existsSync(dataDir)) {
    const dataFiles = fse.readdirSync(dataDir);

    dataFiles.forEach(file => {
      let data;
      try {
        data = JSON.parse(fse.readFileSync(path.join(dataDir, file)));
      } catch (e) {
        console.log(
          `${chalk.redBright(
            "Invalid JSON encountered in"
          )} ${chalk.yellowBright(file)}`
        );
        process.exit(1);
      }

      Object.assign(globalData, { [path.parse(file).name]: data });
    });
  }

  return globalData;
}

module.exports = getGlobalData();
