require = require('esm')(module);
const { Server } = require('./api/server');
const path = require('path');
require('dotenv').config(path.join(__dirname, '.env'));

new Server().start();
