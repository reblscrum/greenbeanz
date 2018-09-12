const puppeteer = require("puppeteer");

let scrape = async query => {
  let searchUrl = `https://primenow.amazon.com/search?k=${query}&p_95=A04H&merchantId=A1TBCG7XHKEQZY&ref_=pn_sr_nav_sr_A04H`;
  // let searchUrl = `https://primenow.amazon.com/search?k=milk&p_95=A04H&merchantId=A1TBCG7XHKEQZY&ref_=pn_sr_nav_sr_A04H`;

  return puppeteer.launch({ headless: true }).then(async browser => {
    const page = await browser.newPage();
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#locationSelectModalContent > div.a-section.a-spacing-medium.a-spacing-top-micro > span > a');
    await page.click('#locationSelectModalContent > div.a-section.a-spacing-medium.a-spacing-top-micro > span > a');
    await page.waitFor(2000);
    await page.click('#houdini-change-location-seeallcities-city-Austin');
    await page.waitForNavigation();
    const result = await page.evaluate(() => {
      let titleArr = [];
      let imgArr = [];
      let priceArr = [];
      let response = [];
      let titleNodes = document.querySelectorAll('div.asin_card__title__uyBBr > div > div');
      let imgNodes = document.querySelectorAll('div.asin_card__thumb__2P3rM > img');
      let priceNodes = document.querySelectorAll('div.asin_price__priceFull__3q4Ym');
      titleNodes.forEach(title => { return titleArr.push(title.innerText); });
      imgNodes.forEach(img => { return imgArr.push(img.src); });
      priceNodes.forEach(price => { return priceArr.push(price.innerText); });
      for (var i = 0; i < titleArr.length; i++) {
        response.push({
          name: titleArr[i],
          image: imgArr[i],
          price: priceArr[i]
        });
      }
      return response;
    });
    await browser.close();
    return result;
  });
};

module.exports = { scrape };
