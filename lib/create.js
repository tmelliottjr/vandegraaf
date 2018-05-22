"use strict";

const fse = require("fs-extra");
const path = require("path");
const hbs = require("handlebars");
const marked = require("marked");
const frontMatter = require("front-matter");
const chalk = require("chalk");
const glob = require("glob");

const siteData = require("./util/loadSiteData");
const globalData = require("./util/loadGlobalData");
const projectPaths = require("./util/loadPaths");

const publicPath = path.join(process.cwd(), projectPaths.public);
const srcPath = path.join(process.cwd(), projectPaths.src);
const templatesPath = path.join(process.cwd(), projectPaths.templates);
const assetsPath = path.join(process.cwd(), projectPaths.assets);

async function create() {

  await fse.ensureDir(publicPath);
  await fse.emptyDir(publicPath);

  await fse.copy(assetsPath, path.join(publicPath, "assets"));

  glob("*.@(hbs|html|md)", { cwd: templatesPath }, (err, files) => {

    // move all templates into their own folder
    // for example tutorials.hbs becomes public/tutorials/index.html

    // TODO: copy folder structure
    // TODO: create global context i.e. {{ title }} from page.title || site.title
    // TODO: see above - add easy relative urls i.e.  {{ urls.about }}

    if (err) {
      console.log(chalk.redBright(err));
    } else {

      files.forEach(async file => {

        let { attributes, body } = frontMatter(
          fse.readFileSync(path.join(templatesPath, file), "utf8")
        );

        let pageContent;
        let { name, ext } = path.parse(file);
        let destinationDir = publicPath;
        
        // create directory for non index[.md, .hbs, .html] files
        if (name !== 'index') {
          destinationDir = path.join(publicPath, name)
          await fse.mkdir(destinationDir);
        }

        switch (ext) {
          case ".md":
            pageContent = marked(body);
            break;
          case ".hbs":
            let template = hbs.compile(body);
            let context = {};
            Object.assign(context, globalData, {site: siteData, page: attributes});
            pageContent = template(context);
            break;
          default:
            // No compiling i.e. .html
            pageContent = body;
            break;
        }

        await fse.writeFile(path.join(destinationDir, 'index.html'), pageContent);

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
    
  } else {
    fse.mkdirSync(path);
  }
}

module.exports = () => {
  create();
};
