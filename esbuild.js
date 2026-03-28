/* eslint-disable import/no-extraneous-dependencies, no-console, no-process-exit */
const esbuild = require('esbuild');
const path = require('path');

const entryPoint = process.argv[2];
const outfile = process.argv[3];

if (!entryPoint || !outfile) {
  console.error('Usage: node esbuild.js <entry> <outfile>');
  process.exit(1);
}

const date = new Date();
const dd = String(date.getDate()).padStart(2, '0');
const mm = String(date.getMonth() + 1).padStart(2, '0');
const yyyy = date.getFullYear();

// UMD wrapper: works in browser (global), CommonJS, and AMD environments
// This replicates browserify's "standalone" option
const umdHeader = `(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ExcelJS = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {`;

const umdFooter = `return ExcelJS;
}));`;

esbuild
  .build({
    entryPoints: [entryPoint],
    bundle: true,
    outfile,
    sourcemap: true,
    globalName: 'ExcelJS',
    format: 'iife',
    target: ['es2015'],
    banner: {
      js: `/*! ExcelJS ${dd}-${mm}-${yyyy} */\n${umdHeader}`,
    },
    footer: {
      js: umdFooter,
    },
    // Map Node.js builtins to browser polyfills/stubs
    alias: {
      fs: path.resolve(__dirname, 'lib/browser/fs-stub.js'),
      crypto: path.resolve(__dirname, 'lib/browser/crypto-stub.js'),
      stream: require.resolve('stream-browserify'),
    },
    define: {
      'process.env.NODE_ENV': '"production"',
      global: 'globalThis',
    },
    inject: [path.resolve(__dirname, 'lib/browser/process-shim.js')],
  })
  .catch(() => process.exit(1));
