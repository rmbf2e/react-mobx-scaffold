// import puppeteer from 'puppeteer'
import devServerConfig from '../build/config'

const { protocal, host, port } = devServerConfig

jest.setTimeout(1000000)

const pageUrl = `${protocal}://${host}:${port}`

describe('goto page', () => {
  beforeAll(async () => {
    // page = await browser.newPage()
    await page.setViewport({
      width: 1920,
      height: 1080,
    })
  })

  it('go to user page', async () => {
    await page.goto(`${pageUrl}/user`)
    await page.waitForSelector('label[for="account"]')
    await page.waitForSelector('label[for="name"]')
    await page.waitForSelector('label[for="mail"]')
    await page.waitForSelector('label[for="mobile"]')
  })

  it('coverage', async () => {
    await Promise.all([
      page.coverage.startJSCoverage(),
      page.coverage.startCSSCoverage(),
    ])
    await page.goto(pageUrl)
    await page.hover('.ant-menu-root')
    await page.click('.ant-menu-item a[href="/user"]')
    // await jestPuppeteer.debug()
    const [jsCoverage, cssCoverage] = await Promise.all([
      page.coverage.stopJSCoverage(),
      page.coverage.stopCSSCoverage(),
    ])
    const coverage = [...jsCoverage, ...cssCoverage]
    let totalBytes = 0
    let usedBytes = 0
    coverage.forEach(entry => {
      totalBytes += entry.text.length
      entry.ranges.forEach(range => {
        usedBytes += range.end - range.start - 1
      })
    })
    console.log(`Bytes used: ${(usedBytes / totalBytes) * 100}%`)
  })
})
