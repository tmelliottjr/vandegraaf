'use strict';

const path = require('path');
const fse = require('fs-extra');
const vdgConfig = require('../dependencies/lib/vdg-config');

const configPath = path.join(process.cwd(), 'vdg.config.json');

const customConfig = fse.existsSync(configPath) ? JSON.parse(fse.readFileSync(configPath)) : {};

module.exports = Object.assign({}, vdgConfig, customConfig);

