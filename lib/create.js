'use strict';

const fse = require('fs-extra');
const path = require('path');
const config = require('./util/load-config');
const hbs = require('handlebars');
const marked = require('marked');
const frontMatter = require('front-matter');

const publicPath = path.join(process.cwd(), 'public');
const srcPath = path.join(process.cwd(), 'src');

function create () {

  // Empty public for project build
  if (fse.pathExistsSync(publicPath)){
    fse.emptyDirSync(publicPath);
  } else {
    fse.mkdirSync(publicPath);
  } 

  const context = loadContext('my data yeah!');
  const template = hbs.compile(context.content);
  console.log(template(context));



}

function loadData() {
  
}

function loadContext(data) {

  // TODO: Get custom data
  let context = {
    site: '',
    page: '',
    content: '',
  }
  context.content = '<html>{{ site }}</html';
  
  return context; 
}


module.exports = () => {
  create();
}

