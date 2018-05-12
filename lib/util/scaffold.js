'use strict';

const fse = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

async function scaffold(current, targetPath, dirStructure) {

  if (!current) {
    console.log(chalk.blueBright('Creating project directory.'));
    await fse.mkdir(targetPath);
  } 

  dirStructure.forEach( async (dir) => {
    if (dir.name) {
      console.log(chalk.blueBright(`Creating ${dir.name} directory.`));
      const newDir = path.resolve(targetPath, dir.name)
      await fse.mkdir(newDir);
      
      if (typeof dir.children !== 'undefined' && dir.children.length > 0) {
        scaffold(true, newDir, dir.children);
      }
    }
  });
};

module.exports = (current, targetPath, dirStructure) => {
  scaffold(current, targetPath, dirStructure);
};