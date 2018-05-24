"use strict";

const path = require("path");
const serve = require("serve");
const chalk = require("chalk");
const clearTerminal = require("./util/clearTerminal");

module.exports = () => {
  clearTerminal();

  console.log(chalk.greenBright("starting development server...\n"));
  console.log(chalk.greenBright("press ctrl-c to stop"));

  serve("./public");
};
