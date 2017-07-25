#! /usr/bin/env node

/*
Starting ReactNative 0.46, the metro packager does not expose ReactNativeEventEmitter or EventPluginRegistry
Consequently, the four files 
 - ReactNativeFiber-dev.js
 - ReactNativeFiber-prod.js
 - ReactNativeStack-dev.js
 - ReactNativeStack-prod.js

at node_modules/react-native/Libraries/Renderer/

*/

var fs = require('fs');
function patchFile(filename) {
  var contents = fs.readFileSync(filename, 'utf-8');
  if (!/__MK__/.test(contents)) {
    contents = contents.replace('EventPluginRegistry_1', 'EventPluginRegistry_1=global.__MK__EventPluginRegistry');
    contents = contents.replace('ReactNativeEventEmitter_1', 'ReactNativeEventEmitter_1=global.__MK__ReactNativeEventEmitter');
    fs.writeFileSync(filename, contents);
    console.log('Patched ', filename);
  }
}

var path = require('path');
[
  'ReactNativeFiber-dev.js',
  'ReactNativeFiber-prod.js',
  'ReactNativeStack-dev.js',
  'ReactNativeStack-prod.js'
].forEach(function (file) {
  patchFile('./node_modules/react-native/Libraries/Renderer/' + file);
});