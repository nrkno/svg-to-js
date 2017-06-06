# svg-to-js
Module for concatenating SVG files into JavaScript


## Usage


    const options = {
      svgFileName: 'core-icons.js',
      svgFileNameMin: 'core-icons.min.js',
      srcPath: path.join(__dirname, '../src'),
      distPath: path.join(__dirname, '../dist'),
      banner: `Copyright (c) 2015-${yearReplacePattern} NRK <opensource@nrk.no>`
    };

    concatSvg(options)
      .then(() => console.log('Merged and minified SVG')))
      .catch((err) => console.log(err.stack));
