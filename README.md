# svg-to-js
Module for concatenating SVG files into JavaScript.

##### Why load icons as JavaScript?
SVG symbols are great for styling and accessibility, but can not load cross domain, or from external file and in IE (9,10,11). Javascript provides us a cacheable, cross-domain method load the icons, without adding extra overhead to each html-file.


## Usage
```
const svgtojs = require('@nrk/svg-to-js');
const options = {
  svgFileName: 'core-icons.js',                 // Name of js-widh-svgs-file to create
  svgFileNameMin: 'core-icons.min.js',          // Name of minified js-widh-svgs-file
  srcPath: path.join(__dirname, '../src'),      // Folder of original svg files
  distPath: path.join(__dirname, '../dist'),    // Where to put js-widh-svgs-file
  banner: 'Copyright 2015-2017'                 // Text to add to top of file
}

svgtojs(options)
  .then(() => console.log('Merged and minified SVG')))
  .catch((err) => console.log(err.stack));
```
