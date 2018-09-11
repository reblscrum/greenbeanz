const searchUrl = 'https://www.heb.com/search/?q=milk';

// const getMilk = (cb) => {
//   axios.get(searchUrl)
//     .then(res => {
//       console.log(res);
//       cb(null, res);
//     })
//     .catch(err => {
//       console.log(err);
//       cb(err, null);
//     });
// };

const puppeteer = require('puppeteer');

let scrape = async (query) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.heb.com/search/?q=' + query);
  await page.waitFor(500);
  // Scrape
  // await page.click('#default > div > div > div > div > section > div:nth-child(2) > ol > li:nth-child(1) > article > div.image_container > a');
  const result = await page.evaluate(() => {
    let title = document.querySelector('#ajaxCategoryDisplay > div > ul > li:nth-child(1) > div.responsivegriditem-middle > div.responsivegriditem__title').innerText;
    // let price = document.querySelector('#ajaxCategoryDisplay > div > ul > li:nth-child(1) > div.responsivegriditem-middle > div.responsivegriditem__title > a > span > span').innerText;
    return { title };
  });
  return result;
};

module.exports = { scrape };
