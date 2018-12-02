const puppeteer = require('puppeteer');
const axeCore = require('axe-core');
const { parse: parseURL } = require('url');
const assert = require('assert');


describe('homepage renders test', async () => {
  let browser, page;

  before(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.setViewport( { width: 1280, height: 800} );

  });
  after(async () => {
    await browser.close();
  });

  it('renders homepage with cta', async () => {
    await page.goto('https://delivermyride.com/', {waitUntil: 'domcontentloaded'});
    assert.equal(await page.title(), 'Deliver My Ride');
    let cta = await page.$eval('#mast-submit', el => el.textContent);

    assert.equal(cta.trim(), 'Search')

    assert.equal(await page.$$eval('.dmr-mast__style_select label.btn', list => list.length), 8);
  });

  it('renders homepage with 0 axe warnings', async () => {
    await page.goto('https://delivermyride.com/', {waitUntil: 'domcontentloaded'});
    let handle = await page.evaluateHandle(`${axeCore.source} axe.run()`);
    let results =  await handle.jsonValue();
    console.log(results.violations);
    assert.equal(results.violations.length, 0)
  })
});
