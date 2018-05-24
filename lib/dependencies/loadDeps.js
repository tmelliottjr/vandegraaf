"use strict";

const fse = require("fs-extra");
const path = require("path");
const toCamelCase = require("lodash.camelcase");

const dependencyLib = path.join(__dirname, "lib");
const dependencies = fse.readdirSync(dependencyLib);

dependencies.forEach(dep => {
  exports[toCamelCase(path.basename(dep, ".js"))] = require(path.join(
    dependencyLib,
    dep
  ));
});
