# @nrk/svg-to-js
> Module for concatenating SVG files into JavaScript.

##### Why load icons as JavaScript?
SVG symbols are great for styling and accessibility, but can not load cross domain, or from external file and in IE (9,10,11). Javascript provides us a cacheable, cross-domain method to load the icons, without adding extra overhead to each html-file.

## Installation

```sh
npm install @nrk/svg-to-js
```

## Basic Usage

```js
import svgtojs from '@nrk/svg-to-js'

const options = {
  input: 'src/',                      // Required. Folder with SVG files
  banner: 'Made with @nrk/svg-to-js', // Optional. Text to add as comment in top of file
  scale: 1,                           // Optional. Scale factor for width/height attributes in em

  // svgtojs always returns Object of outputs,
  // but can optionally also write files:
  esm: 'core-icons.esm.js',   // ES module for bundlers exposing `export const iconName = '<svg...'`
  cjs: 'core-icons.js',       // CommonJS for Node exposing `module.exports = { iconName: '<svg...' }`
  esmx: 'core-icons.esm.jsx', // JSX ES module, exposing React components with `export`
  cjsx: 'core-icons.cjs.jsx', // JSX CommonJS, exposing React components with `module.exports`
  iife: 'core-icons.min.js',   // Self executing <script>, exposing all icons as symbols on page,
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

## Using custom outputs

You can add custom outputs by providing the correct array of `customOutputs`. Each configuration is composed by these keys:

* required `parser`
* required `filename`
* optional `includeBanner` 

Use `parser` as a callback to transform the contents of every svg on your list. 
This functions provides an icon config object including `camelCase` name of file, `svg` contents, `symbol` string and `jsx` string.

Use `filename` to provide the output filename.

Use `includeBanner` as boolean to include banner on top of your output file.

### Usage with custom outputs

```js
import svgtojs from '@nrk/svg-to-js'

const customOutputs = [{
  includeBanner: true,
  parser({ camelCase, svg }) {
    return `exports.${camelCase} = {render() { return (${svg});}}`    
  },
  filename: 'output.jsx'
}]

const options = {
  banner: '/** Copyright NRK **/',
  input: __dirname,
  customOutputs: customOutputs
}

svgtojs(options)
// => Returns {
//  esm: String,
//  cjs: String,
//  esmx: String,
//  cjsx: String,
//  iife: String,
//  dts: String,
//  dtsx: String,
//  custom_1: String
//}
```

Sample output file:

```js
/** Copyright NRK **/
exports.nrkBell = {render() { return (<svg viewBox="0 0 15 15" class="nrk-bell" width="15.000em" height="15.000em" aria-hidden="true" focusable="false"><path stroke="currentColor" fill="none" d="M7.5081246 2.5C4.0162492 2.5 4 5.38865948 4 6.2861215V9c0 1-1.5166599 1.7192343-1.5 2 .03450336.5814775.27977082.4920386.9090909.4920386h8.1818182C12.2186267 11.4920386 12.5 11.5 12.5 11c0-.3060964-1.5-1-1.5-2V6.2861215C11 5.35488333 11 2.5 7.5081246 2.5z"/><path d="M8.75 12.5h-2.5s0 1.25 1.25 1.25 1.25-1.25 1.25-1.25z"/><path stroke="currentColor" d="M7.5 1.5V2" stroke-linecap="round"/></svg>);}}
exports.nrkCloseNoViewBox = {render() { return (<svg viewBox="0 0 15 15" class="nrk-close-no-viewBox" width="15.000em" height="15.000em" aria-hidden="true" focusable="false"><path stroke="currentColor" stroke-linecap="round" d="M2 2l11 11M2 13L13 2"/></svg>);}}
exports.nrkClose = {render() { return (<svg viewBox="0 0 15 15" class="nrk-close" width="15.000em" height="15.000em" aria-hidden="true" focusable="false"><path stroke="currentColor" stroke-linecap="round" d="M2 2l11 11M2 13L13 2"/></svg>);}}

```