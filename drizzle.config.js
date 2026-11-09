const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '.env'),
});

const { defineConfig } = require('drizzle-kit');

module.exports = defineConfig({
  schema: './src/models/*.model.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URL,
  },
  verbose: true,
  strict: true,
});