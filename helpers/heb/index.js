const puppeteer = require('puppeteer');

let scrape = async (query) => {
  let searchUrl = 'https://www.heb.com/search/?q=' + query;

  return puppeteer.launch({ headless: true }).then(async browser => {
    const page = await browser.newPage();
    await page.setJavaScriptEnabled(true);
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

    // scrape scrape scrape
    const result = await page.evaluate(() => {
      let titleArr = [];
      let imgArr = [];
      let priceArr = [];
      let titles = document.querySelectorAll('div.responsivegriditem-middle > div.responsivegriditem__title > a > span');
      let imges = document.querySelectorAll('div.responsivegriditem-top > div.cat-list-img > a > img');
      let prices = document.querySelectorAll('.cat-price > span');
      titles.forEach(title => { return titleArr.push(title.innerText); });
      imges.forEach(img => { return imgArr.push(img.src); });
      prices.forEach(price => { return priceArr.push(price.innerText); });
      return { titleArr, imgArr, priceArr };
    });
    await browser.close();
    return result;
  });
};

module.exports = { scrape };