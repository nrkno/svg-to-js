
/**
 *
 * @param {String} markup Stringified svg markup
 * @return {Object | null} Object with key-value pairs of attributes
 */
export function parseSVGTagPresentationAttributes (markup) {
  // Select tagName and all attributes as string from first matching tag
  const tagParsingPattern = /<([a-z][a-z0-9]*)\s*([^>]*?)(\/?)>/
  const { 1: tagName, 2: attributes } = tagParsingPattern.exec(markup)
  if (tagName !== 'svg') {
    console.warn(`getSVGTagPresentationAttributes: Unable to find leading svg-tag, in markup: ${markup}`)
    return null
  }
  // Select key and value from all attributes found in tagParsingPattern - ignores valueless attributes like `hidden`
  const attributeParsingPattern = /(?:^|\s)([a-z-A-Z]*)\s*=\s*((?:'[^']*')|(?:"[^"]*")|\S+)/gi
  const attrs = {}

  for (let match; (match = attributeParsingPattern.exec(attributes));) {
    const { 1: key, 2: val } = match
    const isQuoted = val && (val[0] === '\'' || val[0] === '"')
    if (SVG_PRESENTATION_ATTRIBUTES.indexOf(key.toLowerCase()) > -1) {
      attrs[key.toLowerCase()] = isQuoted ? val.slice(1, val.length - 1) : val
    }
  }
  return Object.keys(attrs).length > 0 ? attrs : null
}

// Attributes according to https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation
const SVG_PRESENTATION_ATTRIBUTES = [
  'alignment-baseline',
  'baseline-shift',
  'clip-path',
  'clip-rule',
  'color',
  'color-interpolation',
  'color-interpolation-filters',
  'color-rendering',
  'cursor',
  'd',
  'direction',
  'display',
  'dominant-baseline',
  'fill',
  'fill-opacity',
  'fill-rule',
  'filter',
  'flood-color',
  'flood-opacity',
  'font-family',
  'font-size',
  'font-size-adjust',
  'font-stretch',
  'font-style',
  'font-variant',
  'font-weight',
  'image-rendering',
  'letter-spacing',
  'lighting-color',
  'marker-end',
  'marker-mid',
  'marker-start',
  'mask',
  'opacity',
  'overflow',
  'pointer-events',
  'shape-rendering',
  'solid-color',
  'solid-opacity',
  'stop-color',
  'stop-opacity',
  'stroke',
  'stroke-dasharray',
  'stroke-dashoffset',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-miterlimit',
  'stroke-opacity',
  'stroke-width',
  'text-anchor',
  'text-decoration',
  'text-rendering',
  'transform',
  'unicode-bidi',
  'vector-effect',
  'visibility',
  'word-spacing',
  'writing-mode'
// 'clip', Deprecated
// 'color-profile', Deprecated
// 'enable-background', Deprecated
// 'glyph-orientation-horizontal', Deprecated
// 'glyph-orientation-vertical', Deprecated
// 'kerning', Deprecated
]
