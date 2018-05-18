"use strict";

const fse = require("fs-extra");
const path = require("path");
const hbs = require("handlebars");
const marked = require("marked");
const frontMatter = require("front-matter");
const chalk = require("chalk");
const glob = require("glob");

const siteConfig = require("./util/loadSiteConfig");
const globalData = require("./util/loadGlobalData");
const projectPaths = require("./util/loadPaths");

const publicPath = path.join(process.cwd(), projectPaths.public);
const srcPath = path.join(process.cwd(), projectPaths.src);
const templatesPath = path.join(process.cwd(), projectPaths.templates);
const assetsPath = path.join(process.cwd(), projectPaths.assets);

async function create() {
  createBuildDir(publicPath);

  await fse.copy(assetsPath, path.join(publicPath, "assets"));

  glob("*.@(hbs|html|md)", { cwd: templatesPath }, (err, files) => {
    if (err) {
      console.log(chalk.redBright(err));
    } else {
      files.forEach(file => {

        let { attributes, body } = frontMatter(
          fse.readFileSync(path.join(templatesPath, file), "utf8")
        );

        let pageContent;
        console.log(path.extname(file));
        switch (path.extname(file)) {
          case ".md":
            break;
          case ".hbs":
            let template = hbs.compile(body);

            // Need better context merging here
            let context = {};
            Object.assign(context, globalData, siteConfig);
            pageContent = template(context);
            break;
          default:
            // No compiling i.e. .html
            pageContent = body;
            break;
        }
        console.log(pageContent);
      });
    }
  });
}

async function getFolderContents(folderPath, pattern) {
  const dirContents = await fse.readdir(folderPath);

  return dirContents;
}

function loadContext(data) {
  let context = {
    site: "",
    page: "",
    content: ""
  };

  context.content = "<html>{{ site }}</html";

  return context;
}

function createBuildDir(path) {
  if (fse.pathExistsSync(path)) {
    fse.emptyDirSync(path);
  } else {
    fse.mkdirSync(path);
  }
}

module.exports = () => {
  create();
};
