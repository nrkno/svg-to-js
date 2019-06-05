# @nrk/svg-to-js
> Module for concatenating SVG files into JavaScript.

##### Why load icons as JavaScript?
SVG symbols are great for styling and accessibility, but can not load cross domain, or from external file and in IE (9,10,11). Javascript provides us a cacheable, cross-domain method load the icons, without adding extra overhead to each html-file.

## Installation

```sh
npm install @nrk/svg-to-js
```

## Usage

```js
import svgtojs = from '@nrk/svg-to-js'

const options = {
  input: 'src/'               // Required. Folder with SVG files
  banner: 'Copyright NRK',    // Optional. Text to add to top of file
  scale: 1,                   // Optional. Scale factor for  width/height attributes in em

  // svgtojs always returns Object of outputs,
  // but can optionally also write files:
  esm: 'core-icons.esm.js',   // ES module for bundlers exposing `export const iconName = '<svg...'`
  cjs: 'core-icons.js',       // CommonJS for Node exposing `module.exports = { iconName: '<svg...' }`
  esmx 'core-icons.esm.jsx',  // JSX ES module, exposing React components with `export`
  cjsx: 'core-icons.cjs.jsx', // JSX CommonJS, exposing React components with `module.exports`
  iife: 'core-icons.min.js'   // Self executing <script>, exposing all icons as symbols on page,
  dts: 'core-icons.d.ts',     // Exposes typescript definitions with `export declare const`
  dtsx: 'core-icons-jsx.d.ts' // Exposes typescript definitions for JSX with `export declare const`
}

svgtojs(options)
// => Returns {
//  esm: String,
//  cjs: String,
//  esmx: String,
//  cjsx: String,
//  iife: String,
//  dts: String,
//  dtsx: String
//}
```
