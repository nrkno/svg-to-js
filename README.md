# @nrk/svg-to-js
> Module for concatenating SVG files into JavaScript.

**Why load icons as JavaScript?**

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

* required `parser`: Callback to transform the contents of each svg in the `config.input` directory. An icon config object is provided as an argument (see example below).
* optional `filename`: Output filename. If not present, no file is written, only config in return object
* optional `includeBanner`: Include `config.banner` as comment in the first line of your output (file)

```js
// Example of icon config object for nrk-close from @nrk/core-icons
{
  camelCase: 'nrkClose',
  titleCase: 'NrkClose',
  symbol: '<symbol viewBox="0 0 24 24" id="nrk-close" ><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12 10.5858l6.2929-6.29289 1.4142 1.41421L13.4142 12l6.2929 6.2929-1.4142 1.4142L12 13.4142l-6.29288 6.2929-1.41421-1.4142L10.5858 12 4.29291 5.70712l1.41421-1.41421L12 10.5858z"/></symbol>',
  svg: '<svg viewBox="0 0 24 24" class="nrk-close" width="24.000em" height="24.000em"  aria-hidden="true" focusable="false"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12 10.5858l6.2929-6.29289 1.4142 1.41421L13.4142 12l6.2929 6.2929-1.4142 1.4142L12 13.4142l-6.29288 6.2929-1.41421-1.4142L10.5858 12 4.29291 5.70712l1.41421-1.41421L12 10.5858z"/></svg>',
  jsx: `var attributes = {'aria-hidden': true, width: '24.000em', height: '24.000em', viewBox: '0 0 24 24', dangerouslySetInnerHTML: {__html: '<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12 10.5858l6.2929-6.29289 1.4142 1.41421L13.4142 12l6.2929 6.2929-1.4142 1.4142L12 13.4142l-6.29288 6.2929-1.41421-1.4142L10.5858 12 4.29291 5.70712l1.41421-1.41421L12 10.5858z"/>'}}\n` +
    '        if (props) Object.keys(props).forEach(function (key) { attributes[key] = props[key] })\n' +
    "        return React.createElement('svg', attributes)"
},
```

### Generate svg strings with id-attributes

```js
// Present in current directory (__dirname):
// nrk-bell.svg
// nrk-close-no-viewBox.svg
// nrk-close.svg
// nrk-download.svg

import svgtojs from '@nrk/svg-to-js'

const customOutputs = [{
  includeBanner: true,
  parser({ camelCase, titleCase, svg }) {
    return `export const ${camelCase} = '${svg.replace('<svg', `<svg id="${titleCase}"`)}';`
  },
  filename: 'id_output.js'
}]

const options = {
  banner: 'Made with @nrk/svg-to-js',
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

Generates custom output file `id_output.js`:

```js
/** Made with @nrk/svg-to-js **/
export const nrkBell = '<svg id="NrkBell" viewBox="0 0 24 24" class="nrk-bell" width="24.000em" height="24.000em"  aria-hidden="true" focusable="false"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M13 1h-2v1.05475C7.86324 2.40036 5 4.38211 5 8v8.5L3 18v2h18v-2l-2-1.5V8c0-3.61788-2.8632-5.59963-6-5.94525V1zm1 20H9.99999c0 1.1046.89541 2 2.00001 2s2-.8954 2-2zM11.9974 4h.0052c1.3984.00051 2.6978.40515 3.5978 1.09086C16.4454 5.73464 17 6.65971 17 8v9.5l.6667.5H6.33333L7 17.5V8c0-1.34029.55463-2.26536 1.39959-2.90914.9-.68571 2.19941-1.09035 3.59781-1.09086z"/></svg>';
export const nrkCloseNoViewBox = '<svg id="NrkCloseNoViewBox" viewBox="0 0 15 15" class="nrk-close-no-viewBox" width="15.000em" height="15.000em"  aria-hidden="true" focusable="false"><path stroke="currentColor" stroke-linecap="round" d="M2 2l11 11M2 13L13 2"/></svg>';
export const nrkClose = '<svg id="NrkClose" viewBox="0 0 24 24" class="nrk-close" width="24.000em" height="24.000em"  aria-hidden="true" focusable="false"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12 10.5858l6.2929-6.29289 1.4142 1.41421L13.4142 12l6.2929 6.2929-1.4142 1.4142L12 13.4142l-6.29288 6.2929-1.41421-1.4142L10.5858 12 4.29291 5.70712l1.41421-1.41421L12 10.5858z"/></svg>';
export const nrkDownload = '<svg id="NrkDownload" viewBox="0 0 24 24" class="nrk-download" width="24.000em" height="24.000em" fill="currentColor" aria-hidden="true" focusable="false"><path d="M13 2h-2v15.1l-7-4.4V15l8 5 8-5v-2.3l-7 4.4V2Z"/><path d="M4 22h16v2H4z" opacity=".5"/></svg>';

```
