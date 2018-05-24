#!/usr/bin/env node

"use strict";

const program = require("commander");
const chalk = require("chalk");
//const program = require('commander');

program
  .command("init <site-name>")
  .option("-f, --force, Overwrite existing directory if exists")
  .description("generate an empty vandegraaf project")
  .action((name, cmd) => require("../lib/init")(name, cmd));

program
  .command("create")
  .description("generate site")
  .action(cmd => require("../lib/create")(cmd));

program
  .command("serve")
  .description("development server")
  .action(cmd => require("../lib/server")(cmd));

program
  .version("0.0.1", "-v, --version")
  .usage("<command> [options]")
  .parse(process.argv);

// display help on invalid arguments
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
