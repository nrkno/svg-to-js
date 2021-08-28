import path from 'path'
import fs from 'fs'

export default function svgToJS (config) {
  const banner = config.banner || 'svg-to-js'
  const scale = config.scale || 1
  const files = fs.readdirSync(config.input)
  const icons = []

  for (const file of files) {
    if (file.slice(-4) !== '.svg') continue
    const code = fs.readFileSync(path.join(config.input, file), 'utf-8')
    const size = String(code.match(/viewBox="[^"]+/)).slice(9)
    const name = file.slice(0, -4)
    const body = code.replace(/^[^>]+>|<[^<]+$/g, '').replace(/\s*([<>])\s*/g, '$1') // Minified SVG body
    const camelCase = name.replace(/-+./g, (m) => m.slice(-1).toUpperCase())
    const titleCase = camelCase.replace(/./, (m) => m.toUpperCase())
    const [w, h] = size.split(' ').slice(2).map((val) => `${(val / scale).toFixed(3)}em`)
    if (!h) { 
      // throw new Error(("Malformed viewBox in SVG " + file)) 
    
      w = String(code.match(/width="[^"]+/)).slice(7);
      h = String(code.match(/height="[^"]+/)).slice(8);
      size = `0 0 ${w} ${h}`
    }

    icons.push({
      camelCase,
      titleCase,
      symbol: `<symbol viewBox="${size}" id="${name}">${body}</symbol>`,
      svg: `<svg viewBox="${size}" class="${name}" width="${w}" height="${h}" aria-hidden="true" focusable="false">${body}</svg>`,
      jsx: `return React.createElement('svg', {'aria-hidden': true, width: '${w}', height: '${h}', viewBox: '${size}', dangerouslySetInnerHTML: {__html: '${body}'}})`
    })
  }

  const result = {
    iife: `/*!${banner}*/\n(function(el){el.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${icons.map(({ symbol }) => symbol).join('')}</svg>';document.head.appendChild(el.firstElementChild)})(document.createElement('div'))`,
    cjs: icons.map(({ camelCase, svg }) => `exports.${camelCase} = '${svg}'`).join('\n'),
    esm: icons.map(({ camelCase, svg }) => `export const ${camelCase} = '${svg}'`).join('\n'),
    cjsx: `var React = require('react')${icons.map(({ titleCase, jsx }) => `\nexports.${titleCase} = function () {${jsx}}`).join('')}`,
    esmx: `import React from 'react'${icons.map(({ titleCase, jsx }) => `\nexport function ${titleCase} () {${jsx}}`).join('')}`,
    dts: icons.map(({ camelCase }) => `export declare const ${camelCase}: string`).join('\n'),
    dtsx: icons.map(({ titleCase }) => `export declare const ${titleCase}: React.FunctionComponent<React.SVGProps<SVGElement>>`).join('\n')
  }

  // Save files if specified in config
  Object.keys(config).forEach((type) => {
    if (result[type]) fs.writeFileSync(config[type], result[type])
  })

  return result
}
