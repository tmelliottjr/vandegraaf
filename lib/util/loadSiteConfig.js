'use strict';

const path = require('path');
const fse = require('fs-extra');
const defaultSiteConfig = require('../dependencies/lib/defaultSiteConfig');

const siteConfigPath = path.join(process.cwd(), 'vdg.config.json');

const customSiteConfig = fse.existsSync(siteConfigPath) ? JSON.parse(fse.readFileSync(siteConfigPath)) : {};

module.exports = Object.assign({}, defaultSiteConfig, customSiteConfig);