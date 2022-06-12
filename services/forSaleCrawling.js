const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { By, until } = require('selenium-webdriver');

const Forsale = require('../model/Forsale');

const { getCoordsFromAddress } = require('../utils/helpers');

async function runForSaleCrawling() {
  const service = new chrome.ServiceBuilder(
    process.env.DRIVER_FILE_PATH,
  ).build();

  chrome.setDefaultService(service);

  const driver = await new webdriver.Builder().forBrowser('chrome').build();

  await driver.manage().setTimeouts({
    implicit: 10000,
    pageLoad: 30000,
    script: 30000,
  });

  await InputSearchResults(driver);
  await autoSearchNextPage(driver);
  await driver.close();
}

async function InputSearchResults(driver) {
  await driver.get(process.env.WEB_PATH_114);

  const StartSearch = await driver.findElement(By.id('dqSearchTerm'));
  await StartSearch.sendKeys('서울특별시');

  const SearchButton = await driver.findElement(By.linkText('검색버튼'));
  await SearchButton.click();

  const checkApartment = await driver.findElement(By.className('apt'));
  await checkApartment.click();
}

async function autoSearchNextPage(driver) {
  await driver.findElement(By.className('paging'));

  for (let i = 2; i < 100; i++) {
    if (i % 10 === 1) {
      const nextPageLink = await driver
        .findElement(By.className('paging'))
        .findElement(By.linkText('다음10페이지'));
      await nextPageLink.click();

      continue;
    }

    await connectToDetailPage(driver);

    const nextLink = await driver.findElement(By.linkText(`${i}`));
    await nextLink.click();

    console.log(By.linkText(`${i}`));
  }
}

async function connectToDetailPage(driver) {
  const listForSale = await driver.findElement(By.className('list_article'));
  const forSaleListArray = await listForSale.findElements(By.tagName('li'));
  const forSaleLink = [];
  const link = 'https://www.r114.com/?_c=memul&_m=HouseDetail&mulcode=';

  for (let i = 0; i < forSaleListArray.length; i++) {
    await driver.wait(until.elementLocated(By.tagName('li'), 10000));

    const forSaleData = await forSaleListArray[i]
      .findElement(By.className('cont'))
      .getAttribute('href');
    const linkAlter = forSaleData.slice(33, 47);

    forSaleLink.push(link + linkAlter);
  }

  for (let i = 0; i < forSaleLink.length; i++) {
    await driver.get(forSaleLink[i]);
    await crawlingDetail(driver);
    await driver.navigate().back();
  }
}

async function crawlingDetail(driver) {
  const [name, address, squareMeters, price] = await getBasicInfo(driver);
  const point = await getCoordsFromAddress(name);
  const coords = {
    type: 'Point',
    coordinates: point,
  };
  const forSaleData = {
    name,
    address,
    squareMeters,
    price,
    coords,
  };

  await saveForSaleData(forSaleData, driver);
}

async function getBasicInfo(driver) {
  let name = '';
  let address = '';
  let squareMeters = '';
  let price = '';

  const apartmentNameElement = await driver.findElement(
    By.xpath('//*[@id="body_layout"]/div[2]/div[2]/div[2]/div/strong'),
  );

  name = await apartmentNameElement.getText();

  const addressElement = await driver.findElement(
    By.xpath('//*[@id="spnAddr1"]'),
  );

  address = await addressElement.getText();
  address = address.slice(0, -6);

  await driver.findElement(By.id('btnSummarySwapArea')).click();
  const squareMetersElement = await driver.findElement(
    By.xpath('//*[@id="body_layout"]/div[2]/div[2]/div[3]/ul/li[1]/dl/dd'),
  );

  squareMeters = await squareMetersElement.getText();

  const priceElement = await driver.findElement(
    By.xpath('//*[@id="body_layout"]/div[2]/div[2]/div[3]/ul/li[2]/dl/dd/em'),
  );

  price = await priceElement.getText();
  price = price.replace(` 만원`, `,000 원`);

  return [name, address, squareMeters, price];
}

async function saveForSaleData(forSaleData) {
  const origin = await Forsale.findOne({ coords: forSaleData.coords });

  if (!origin) {
    const forsale = new Forsale(forSaleData);
    await forsale.save();
  }
}

module.exports = { runForSaleCrawling };
