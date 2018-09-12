const puppeteer = require("puppeteer");

let scrape = async query => {
  // let searchUrl = `https://primenow.amazon.com/search?k=${query}&p_95=A04H&merchantId=A1TBCG7XHKEQZY&ref_=pn_sr_nav_sr_A04H`;
  let searchUrl = `https://primenow.amazon.com/search?k=milk&p_95=A04H&merchantId=A1TBCG7XHKEQZY&ref_=pn_sr_nav_sr_A04H`;

  return puppeteer.launch({ headless: false }).then(async browser => {
    const page = await browser.newPage();
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#locationSelectModalContent > div.a-section.a-spacing-medium.a-spacing-top-micro > span > a');
    await page.click('#locationSelectModalContent > div.a-section.a-spacing-medium.a-spacing-top-micro > span > a');
    await page.waitFor(2000);
    await page.click('#houdini-change-location-seeallcities-city-Austin');
    await page.waitForNavigation();
    return await page.evaluate(() => {
      let titleArr = [];
      let imgArr = [];
      let priceArr = [];
      let titleNodes = document.querySelectorAll('div.asin_card__title__uyBBr > div > div');
      titleNodes.forEach(title => { return titleArr.push(title.innerText); });
      return titleArr;
    });
  });

  // return puppeteer.launch({ headless: false }).then(async browser => {
  //   const page = await browser.newPage();
  //   await page.setJavaScriptEnabled(true);
  //   await page.goto(searchUrl, { waitUntil: "domcontentloaded" });
  //   await page.waitForNavigation({ waitUntil: "domcontentloaded" });

  //   // scrape scrape scrape
  //   const result = await page.evaluate(() => {
  //     let titleArr = [];
  //     let imgArr = [];
  //     let priceArr = [];
  //     let titles = document.querySelectorAll(
  //       "div.responsivegriditem-middle > div.responsivegriditem__title > a > span"
  //     );
  //     let imges = document.querySelectorAll(
  //       "div.responsivegriditem-top > div.cat-list-img > a > img"
  //     );
  //     let prices = document.querySelectorAll(".cat-price > span");
  //     titles.forEach(title => {
  //       return titleArr.push(title.innerText);
  //     });
  //     imges.forEach(img => {
  //       return imgArr.push(img.src);
  //     });
  //     prices.forEach(price => {
  //       return priceArr.push(price.innerText);
  //     });

  //     let response = [];
  //     for (var i = 0; i < titleArr.length; i++) {
  //       response.push({
  //         name: titleArr[i],
  //         image: imgArr[i],
  //         price: priceArr[i]
  //       });
  //     }
  //     return response;
  //     // return { titleArr, imgArr, priceArr };
  //   });
  //   await browser.close();
  //   return result;
  // });
};

module.exports = { scrape };
