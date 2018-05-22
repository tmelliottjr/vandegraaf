'use strict';

const path = require('path');
const fse = require('fs-extra');
const defaultSiteData = require('../dependencies/lib/defaultSiteData');

const siteDataPath = path.join(process.cwd(), 'vdg.config.json');

const customSiteData = fse.existsSync(siteDataPath) ? JSON.parse(fse.readFileSync(siteDataPath)) : {};

module.exports = Object.assign({}, defaultSiteData, customSiteData);