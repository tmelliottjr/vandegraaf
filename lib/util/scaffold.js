"use strict";

const fse = require("fs-extra");
const path = require("path");
const chalk = require("chalk");

const projectPaths = require("../util/loadPaths");

async function scaffold(targetDir) {
  console.log(chalk.blueBright("Creating project directory."));
  await fse.mkdir(targetDir);

  Object.values(projectPaths).forEach(async projetPath => {
    if (projectPath) {
      console.log(chalk.blueBright(`Creating ${projectPath.dir}`));
      await fse.mkdir(path.join(targetDir, projectPath.dir));
    }
  });
}

module.exports = targetDir => {
  scaffold(targetDir);
};
