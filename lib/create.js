'use strict';

const fse = require('fs-extra');
const path = require('path');
const hbs = require('handlebars');
const marked = require('marked');
const frontMatter = require('front-matter');
const chalk = require('chalk');

const siteConfig = require('./util/loadSiteConfig');
const globalData = require('./util/loadGlobalData');
const projectPaths = require('./util/loadPaths');

const publicPath = path.join(process.cwd(), projectPaths.public);
const srcPath = path.join(process.cwd(), projectPaths.src);

function create () {

  emptyCreateDir(publicPath);

  console.log(srcPath, publicPath);

  console.log(globalData);

  // const template = hbs.compile(context.content);
}

function loadContext(data) {

  let context = {
    site: '',
    page: '',
    content: '',
  }

  context.content = '<html>{{ site }}</html';
  
  return context; 
}

function emptyCreateDir(path) {
  if (fse.pathExistsSync(path)) {
    fse.emptyDirSync(path);
  } else {
    fse.mkdirSync(path);
  } 
}

module.exports = () => {
  create();
}

