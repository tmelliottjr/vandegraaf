"use strict";

const promisify = require("util").promisify;
const fse = require("fs-extra");
const path = require("path");
const hbs = require("handlebars");
const marked = require("marked");
const frontMatter = require("front-matter");
const chalk = require("chalk");
const glob = promisify(require("glob"));

const siteData = require("./util/loadSiteData");
const globalData = require("./util/loadGlobalData");
const projectPaths = require("./util/loadPaths");

async function create() {
  let layouts = await glob("*.hbs", { cwd: projectPaths.layouts.cwd });
  let templates = [];

  await fse.ensureDir(projectPaths.public.cwd);
  await fse.emptyDir(projectPaths.public.cwd);

  await fse.copy(
    projectPaths.assets.cwd,
    path.join(projectPaths.public.cwd, "assets")
  );

  try {
    templates = await glob("*.@(hbs|html|md)", {
      cwd: projectPaths.templates.cwd
    });
  } catch (err) {
    console.log(chalk.redBright(err));
    process.exit(1);
  }

  templates.forEach(async templateFile => {
    let { attributes, body } = frontMatter(
      fse.readFileSync(
        path.join(projectPaths.templates.cwd, templateFile),
        "utf8"
      )
    );

    let doLayout = false;
    let layoutContent;
    if (layouts.includes(`${attributes.layout}.hbs`)) {
      doLayout = true;
      layoutContent = fse.readFileSync(
        path.join(projectPaths.layouts.cwd, `${attributes.layout}.hbs`),
        "utf8"
      );
    } else if (typeof attributes.layout !== "undefined") {
      console.log(
        chalk.redBright(`Layout ${chalk.yellow(attributes.layout)} not found.`)
      );
    }

    let { name, ext } = path.parse(templateFile);
    let destinationDir = projectPaths.public.cwd;

    // create directory for non index[.md, .hbs, .html] files
    if (name !== "index") {
      destinationDir = path.join(projectPaths.public.cwd, name);
      await fse.mkdir(destinationDir);
    }

    // build page context
    let context = {};
    Object.assign(context, globalData, {
      site: siteData,
      page: attributes
    });

    let pageContent;
    let template;
    switch (ext) {
      case ".md":
        pageContent = marked(body);
        break;
      case ".hbs":
        template = hbs.compile(body);
        pageContent = template(context);
        break;
      default:
        // No compiling i.e. .html
        pageContent = body;
        break;
    }
    
    if (doLayout) {
      Object.assign(context, {
        body: new hbs.SafeString(pageContent)
      });
      template = hbs.compile(layoutContent);
      pageContent = template(context);
    }

    await fse.writeFile(path.join(destinationDir, "index.html"), pageContent);
  });
}

module.exports = () => {
  create();
};
