/* eslint-disable */
// Minimal process shim for browser builds (injected by esbuild)
if (typeof process === 'undefined') {
  var process = {
    env: {},
    nextTick: function (fn) {
      setTimeout(fn, 0);
    },
  };
}
