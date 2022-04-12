const svgtojs = require('../lib/svg-to-js.cjs.js')

const BANNER_TEXT = 'Copyright'

const BLUEPRINT = `/*!${BANNER_TEXT}*/
(function(el){el.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" style="display:none"><symbol viewBox="0 0 15 15" id="nrk-bell"><path stroke="currentColor" fill="none" d="M7.5081246 2.5C4.0162492 2.5 4 5.38865948 4 6.2861215V9c0 1-1.5166599 1.7192343-1.5 2 .03450336.5814775.27977082.4920386.9090909.4920386h8.1818182C12.2186267 11.4920386 12.5 11.5 12.5 11c0-.3060964-1.5-1-1.5-2V6.2861215C11 5.35488333 11 2.5 7.5081246 2.5z"/><path d="M8.75 12.5h-2.5s0 1.25 1.25 1.25 1.25-1.25 1.25-1.25z"/><path stroke="currentColor" d="M7.5 1.5V2" stroke-linecap="round"/></symbol><symbol viewBox="0 0 15 15" id="nrk-close-no-viewBox"><path stroke="currentColor" stroke-linecap="round" d="M2 2l11 11M2 13L13 2"/></symbol><symbol viewBox="0 0 15 15" id="nrk-close"><path stroke="currentColor" stroke-linecap="round" d="M2 2l11 11M2 13L13 2"/></symbol></svg>';document.head.appendChild(el.firstElementChild)})(document.createElement('div'))`

const result = svgtojs({
  banner: BANNER_TEXT,
  input: __dirname
})

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
    expect(result.iife.match(/<symbol/g).length).toBe(3)
  })

  it('iife should equal blueprint', () => {
    expect(result.iife).toBe(BLUEPRINT)
  })

  it('executing iife should append to document', () => {
    document.body.innerHTML = result.iife
    expect(document.querySelectorAll('#nrk-bell').length).toBe(1)
    expect(document.querySelectorAll('symbol').length).toBe(3)
    expect(document.querySelectorAll('svg').length).toBe(1)
  })

  it('jsx should be ES5 compatible', () => {
    expect(result.cjsx).not.toMatch(/(const|let)\s?=/)
  })
})

describe('Config: customOutputs', () => {
  const customOutputs = [{
    parser ({ camelCase, svg }) {
      const path = svg.match(/path[^>]+d="([^"]+)"/)
      return path ? `export const ${camelCase} = "${path[1]}";` : ''
    },
    filename: 'test_1'
  }, {
    includeBanner: true,
    parser ({ camelCase, svg, titleCase }) {
      return `exports.${camelCase} = {render() { 
        return (${svg.replace('<svg', `<svg id="${titleCase}"`)});
      }}
      `.trim()
    },
    filename: 'test_2'
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

  it('no customOutputs creates no custom entries', () => {
    expect(Object.keys(result).some(key => key.startsWith('custom_'))).toBe(false)
  })

  it('customOutputs should create new results', () => {
    expect(resultWithCustom.custom_1.split('\n').length).toBe(4)
    expect(resultWithCustom.custom_2.split('\n').length).toBe(10)
  })

  it('banners should be included when it is explicit', () => {
    expect(resultWithCustom.custom_1.includes(BANNER_TEXT)).toBe(false)
    expect(resultWithCustom.custom_2.includes(BANNER_TEXT)).toBe(true)
  })

  it('incomplete customOutputs should not be counted', () => {
    const customEntries = Object.keys(resultWithCustom).filter(key => key.startsWith('custom_'))
    const validcustomOutputs = customOutputs.filter(item => item.filename && item.parser)
    expect(customEntries.length).toBe(validcustomOutputs.length)
  })

  it('includeBanners works as expected', () => {
    const bannerCustomOutputs = [{
      includeBanner: false,
      parser () { return '' },
      filename: 'test_3'
    }, {
      includeBanner: true,
      parser () { return '' },
      filename: 'test_4'
    }, {
      parser () { return '' },
      filename: 'test_5'
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
