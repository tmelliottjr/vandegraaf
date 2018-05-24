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

async function create() {
  await fse.ensureDir(projectPaths.public.cwd);
  await fse.emptyDir(projectPaths.public.cwd);

  await fse.copy(
    projectPaths.assets.cwd,
    path.join(projectPaths.public.cwd, "assets")
  );

  glob(
    "*.@(hbs|html|md)",
    { cwd: projectPaths.templates.cwd },
    (err, files) => {
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
            fse.readFileSync(
              path.join(projectPaths.templates.cwd, file),
              "utf8"
            )
          );

          let pageContent;
          let { name, ext } = path.parse(file);
          let destinationDir = projectPaths.public.cwd;

          // create directory for non index[.md, .hbs, .html] files
          if (name !== "index") {
            destinationDir = path.join(projectPaths.public.cwd, name);
            await fse.mkdir(destinationDir);
          }

          switch (ext) {
            case ".md":
              pageContent = marked(body);
              break;
            case ".hbs":
              let template = hbs.compile(body);
              let context = {};
              Object.assign(context, globalData, {
                site: siteData,
                page: attributes
              });
              pageContent = template(context);
              break;
            default:
              // No compiling i.e. .html
              pageContent = body;
              break;
          }

          await fse.writeFile(
            path.join(destinationDir, "index.html"),
            pageContent
          );
        });
      }
    }
  );
}

async function getFolderContents(folderPath, pattern) {
  const dirContents = await fse.readdir(folderPath);

  return dirContents;
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
