"use strict";

const path = require("path");
const fse = require("fs-extra");

const inquirer = require("inquirer");
const chalk = require("chalk");

const scaffold = require("./util/scaffold");

const { dirStructure, defaultSiteConfig } = require("./dependencies/loadDeps");

async function init(siteName, options) {
  const current = siteName === ".";
  const name = current ? path.relative("../", process.cwd()) : siteName;
  const targetPath = path.resolve(siteName || ".");

  defaultSiteConfig.name = name;

  if (fse.existsSync(targetPath)) {
    if (options.force) {
      await fse.remove(name);
    } else {
      if (current) {
        const { useCurrentPath } = await inquirer.prompt([
          {
            type: "confirm",
            name: "useCurrentPath",
            message: "Generate project in current directory?",
            default: "true"
          }
        ]);

        if (useCurrentPath) {
          const existingProjectDirs = dirStructure
            .map(dir => path.resolve(targetPath, dir.name))
            .filter(dir => fse.existsSync(dir));

          if (existingProjectDirs.length > 0) {
            const { overwrite } = await inquirer.prompt([
              {
                type: "list",
                name: "overwrite",
                message: `A project already exists in directory ${chalk.greenBright(
                  targetPath
                )}. Overwrite?`,
                choices: [
                  { name: " Overwrite", value: true },
                  { name: " Cancel", value: false }
                ]
              }
            ]);

            if (overwrite) {
              existingProjectDirs.forEach(dir => {
                fse.removeSync(dir);
              });
            } else {
              return;
            }
          }
        } else {
          return;
        }
      } else {
        const { overwrite } = await inquirer.prompt([
          {
            type: "list",
            name: "overwrite",
            message: `Directory ${chalk.greenBright(
              targetPath
            )} already exists. Overwrite?`,
            choices: [
              { name: " Overwrite", value: true },
              { name: " Cancel", value: false }
            ]
          }
        ]);

        if (!overwrite) {
          process.exit(1);
        } else {
          await fse.remove(targetPath);
        }
      }
    }
  }

  scaffold(targetPath);

  // Add default configuration
  fse.writeFileSync(
    path.join(targetPath, "vdg.config.json"),
    JSON.stringify(defaultSiteConfig, null, 2)
  );
}

module.exports = (name, cmd) => {
  init(name, cmd);
};
