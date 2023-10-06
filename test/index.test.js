const fs = require('fs')
const svgtojs = require('../lib/svg-to-js.cjs.js')

const BANNER_TEXT = 'Generated using @nrk/svg-to-js'

const BLUEPRINT = `/*!${BANNER_TEXT}*/
(function(el){el.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" style="display:none"><symbol viewBox="0 0 24 24" id="nrk-bell" ><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M13 1h-2v1.05475C7.86324 2.40036 5 4.38211 5 8v8.5L3 18v2h18v-2l-2-1.5V8c0-3.61788-2.8632-5.59963-6-5.94525V1zm1 20H9.99999c0 1.1046.89541 2 2.00001 2s2-.8954 2-2zM11.9974 4h.0052c1.3984.00051 2.6978.40515 3.5978 1.09086C16.4454 5.73464 17 6.65971 17 8v9.5l.6667.5H6.33333L7 17.5V8c0-1.34029.55463-2.26536 1.39959-2.90914.9-.68571 2.19941-1.09035 3.59781-1.09086z"/></symbol><symbol viewBox="0 0 15 15" id="nrk-close-no-viewBox" ><path stroke="currentColor" stroke-linecap="round" d="M2 2l11 11M2 13L13 2"/></symbol><symbol viewBox="0 0 24 24" id="nrk-close" ><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12 10.5858l6.2929-6.29289 1.4142 1.41421L13.4142 12l6.2929 6.2929-1.4142 1.4142L12 13.4142l-6.29288 6.2929-1.41421-1.4142L10.5858 12 4.29291 5.70712l1.41421-1.41421L12 10.5858z"/></symbol><symbol viewBox="0 0 24 24" id="nrk-download" fill="currentColor"><path d="M13 2h-2v15.1l-7-4.4V15l8 5 8-5v-2.3l-7 4.4V2Z"/><path d="M4 22h16v2H4z" opacity=".5"/></symbol><symbol viewBox="0 0 24 24" id="nrk-media-direkte-notlive" fill-rule="evenodd" fill="currentColor"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm12-10c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12Z" opacity=".5"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm5-2a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"/></symbol></svg>';document.head.appendChild(el.firstElementChild)})(document.createElement('div'))`

const result = svgtojs({
  banner: BANNER_TEXT,
  input: __dirname
})

const SVG_FILE_COUNT = fs.readdirSync(__dirname).filter((filename) => filename.slice(-4) === '.svg').length

describe('svg-to-js', () => {
  it('iife should should be minified', () => {
    expect(result.iife.split('\n').length).toBe(2)
  })

  it('iife should start with banner', () => {
    expect(result.iife.indexOf(`/*!${BANNER_TEXT}*/`)).toBe(0)
  })

  it('iife should contain svg ids', () => {
    expect(result.iife.indexOf(' id="nrk-bell"') > 0).toBe(true)
    expect(result.iife.indexOf(' id="nrk-close"') > 0).toBe(true)
  })

  it('exports should contain svg class', () => {
    expect(result.esm.indexOf(' class="nrk-bell"') > 0).toBe(true)
    expect(result.cjs.indexOf(' class="nrk-close"') > 0).toBe(true)
  })

  it('iife should be wrapped in hidden svg', () => {
    expect(result.iife.indexOf('xmlns="http://www.w3.org/2000/svg"') > 0).toBe(true)
    expect(result.iife.indexOf(' style="display:none"') > 0).toBe(true)
  })

  it('iife should have only one, valid xmlns definition', () => {
    expect(result.iife.match(/xmlns="http:\/\/www.w3.org\/2000\/svg"/g).length).toBe(1)
  })

  it('iife should contain all symbols', () => {
    expect(result.iife.match(/<symbol/g).length).toBe(SVG_FILE_COUNT)
  })

  it('iife should equal blueprint', () => {
    expect(result.iife).toBe(BLUEPRINT)
  })

  it('executing iife should append to document', () => {
    document.body.innerHTML = result.iife
    expect(document.querySelectorAll('#nrk-bell').length).toBe(1)
    expect(document.querySelectorAll('symbol').length).toBe(SVG_FILE_COUNT)
    expect(document.querySelectorAll('svg').length).toBe(1)
  })

  it('jsx should be ES5 compatible', () => {
    expect(result.cjsx).not.toMatch(/(const|let)\s?=/)
  })

  it('should keep all presentation attributes from svg-tag on symbol for iife', () => {
    document.body.innerHTML = result.iife
    expect(document.querySelector('symbol#nrk-download').attributes.fill.value).toBe('currentColor')
  })

  it('should wrap hyphenated attribute-keys in single-quotes', () => {
    const nrkMediaDirekteNotliveExport = result.cjsx.split('exports.').filter(v => v.startsWith('NrkMediaDirekteNotlive'))[0]
    expect(nrkMediaDirekteNotliveExport.indexOf("'fill-rule': 'evenodd'") !== -1).toBe(true)
  })

  it('should not wrap unhyphenated attribute-keys in single-quotes', () => {
    const nrkMediaDirekteNotliveExport = result.cjsx.split('exports.').filter(v => v.startsWith('NrkMediaDirekteNotlive'))[0]
    expect(nrkMediaDirekteNotliveExport.indexOf("'fill':") === -1).toBe(true)
  })

  it('should keep presentation attributes from svg-tag on svg for cjs', () => {
    expect(result.cjs.indexOf('<svg viewBox="0 0 24 24" class="nrk-download" width="24.000em" height="24.000em" fill="currentColor" aria-hidden="true" focusable="false">') > 0).toBe(true)
  })

  it('should keep presentation attributes from svg-tag as part of attributes-object for cjsx', () => {
    const nrkDownloadExport = result.cjsx.split('exports.').filter(v => v.startsWith('NrkDownload'))[0]
    expect(nrkDownloadExport.indexOf("fill: 'currentColor'") > 0).toBe(true)
  })
})

describe('Config: customOutputs', () => {
  const customOutputs = [{
    parser ({ camelCase, svg }) {
      const path = svg.match(/path[^>]+d="([^"]+)"/)
      return path ? `export const ${camelCase} = "${path[1]}";` : ''
    }
  }, {
    includeBanner: true,
    parser ({ camelCase, svg, titleCase }) {
      return `
exports.${camelCase} = {render() {
  return (${svg.replace('<svg', `<svg id="${titleCase}"`)});
}}`.trim()
    }
  }, {
    parser () {
      return ''
    }
  }]

  const resultWithCustom = svgtojs({
    input: __dirname,
    banner: BANNER_TEXT,
    customOutputs
  })

  const CUSTOM_1_LINE_COUNT = SVG_FILE_COUNT
  // 3 lines per file pluss banner
  const CUSTOM_2_LINE_COUNT = 1 + (SVG_FILE_COUNT * 3)

  it('no customOutputs creates no custom entries', () => {
    expect(Object.keys(result).some(key => key.startsWith('custom_'))).toBe(false)
  })

  it('customOutputs should create new results', () => {
    // Filter empty/falsey values after split to get number of lines
    expect(resultWithCustom.custom_1.split('\n').filter(v => v).length).toBe(CUSTOM_1_LINE_COUNT)
    expect(resultWithCustom.custom_2.split('\n').filter(v => v).length).toBe(CUSTOM_2_LINE_COUNT)
  })

  it('banners should be included when it is explicit', () => {
    expect(resultWithCustom.custom_1.includes(BANNER_TEXT)).toBe(false)
    expect(resultWithCustom.custom_2.includes(BANNER_TEXT)).toBe(true)
  })

  it('incomplete customOutputs should not be counted', () => {
    const customEntries = Object.keys(resultWithCustom).filter(key => key.startsWith('custom_'))
    const validcustomOutputs = customOutputs.filter(item => item.parser)
    expect(customEntries.length).toBe(validcustomOutputs.length)
  })

  it('includeBanners works as expected', () => {
    const bannerCustomOutputs = [{
      includeBanner: false,
      parser () { return '' }
    }, {
      includeBanner: true,
      parser () { return '' }
    }, {
      parser () { return '' }
    }]

    const withBannerResult = svgtojs({
      input: __dirname,
      banner: BANNER_TEXT,
      customOutputs: bannerCustomOutputs
    })
    const noBannerResult = svgtojs({
      input: __dirname,
      customOutputs: bannerCustomOutputs
    })

    expect(withBannerResult.custom_1.includes(BANNER_TEXT)).toBe(false)
    expect(withBannerResult.custom_2.includes(BANNER_TEXT)).toBe(true)
    expect(withBannerResult.custom_3.includes(BANNER_TEXT)).toBe(false)

    expect(noBannerResult.custom_1.includes(BANNER_TEXT)).toBe(false)
    expect(noBannerResult.custom_2.includes(BANNER_TEXT)).toBe(false)
    expect(noBannerResult.custom_3.includes(BANNER_TEXT)).toBe(false)
  })
})
