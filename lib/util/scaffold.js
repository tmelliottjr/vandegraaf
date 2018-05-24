"use strict";

const fse = require("fs-extra");
const path = require("path");
const chalk = require("chalk");

const projectPaths = require("../util/loadPaths");

async function scaffold(targetDir) {
  console.log(chalk.blueBright("Creating project directory."));
  await fse.mkdir(targetDir);

  Object.values(projectPaths).forEach(async dir => {
    if (dir) {
      console.log(chalk.blueBright(`Creating ${dir}`));
      await fse.mkdir(path.join(targetDir, dir));
    }
  });
}

module.exports = targetDir => {
  scaffold(targetDir);
};
