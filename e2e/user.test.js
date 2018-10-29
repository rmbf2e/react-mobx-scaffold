import puppeteer from 'puppeteer'
import devServerConfig from '../build/config'

const { protocal, host, port } = devServerConfig

describe('goto page', () => {
  let browser
  let page
  beforeAll(async () => {
    browser = await puppeteer.launch(
      process.env.DEBUG
        ? {
            headless: false,
            slowMo: 100,
          }
        : {},
    )
    page = await browser.newPage()
  })

  afterEach(async () => {
    await page.close()
  })

  afterAll(async () => {
    await browser.close()
  })

  it('go to user page', async () => {
    await page.goto(`${protocal}://${host}:${port}/user`)
    await page.waitForSelector('label[for="account"]')
    await page.waitForSelector('label[for="name"]')
    await page.waitForSelector('label[for="mail"]')
    await page.waitForSelector('label[for="mobile"]')
  })
})
