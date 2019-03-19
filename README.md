# svg-to-js
Module for concatenating SVG files into JavaScript.

##### Why load icons as JavaScript?
SVG symbols are great for styling and accessibility, but can not load cross domain, or from external file and in IE (9,10,11). Javascript provides us a cacheable, cross-domain method load the icons, without adding extra overhead to each html-file.

## Usage
```
const svgtojs = require('@nrk/svg-to-js')
const options = {
  input: 'src/'               // Required. Folder with SVG files
  banner: 'Copyright NRK',    // Text to add to top of file

  // svgtojs always returns Object of outputs,
  // but can optionally also write files:
  esm: 'core-icons.esm.js',   // ES module for bundlers exposing `export const iconName = '<svg...'`
  cjs: 'core-icons.js',       // CommonJS for Node exposing `module.exports = { iconName: '<svg...' }`
  esmx 'core-icons.esm.jsx',  // JSX ES module, exposing React components with `export`
  cjsx: 'core-icons.cjs.jsx', // JSX CommonJS, exposing React components with `module.exports`
  iife: 'core-icons.min.js'   // Self executing <script>, exposing all icons as symbols on page
}

svgtojs(options) // => Returns {
  esm: String,
  cjs: String,
  esmx: String,
  cjsx: String,
  iife: String
}
```
