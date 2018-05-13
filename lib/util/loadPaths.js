'use strict';

const path = require('path');
const dirStructure = require('../dependencies/lib/dirStructure');

function loadPaths(){
  const paths = {};

  dirStructure.forEach((dir) => {
    Object.assign(paths, buildPaths(dir));
    if (dir.children) {
      dir.children.forEach((subDir) => {
        Object.assign(paths, buildPaths(dir, subDir));
      })
    }
  });

  return paths;
}

function buildPaths(dir, subDir) {
  let dirName = dir.name;
  let folder = dir.name;
  
  if (subDir) {
    dirName = subDir.name;
    folder = path.join(dir.name, subDir.name);
  }

  return { [dirName]: folder };
}

module.exports = loadPaths();