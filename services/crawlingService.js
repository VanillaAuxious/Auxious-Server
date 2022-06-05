const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { By, Key, Navigation, until } = require('selenium-webdriver');
const cheerio = require('cheerio');
const axios = require('axios');

async function run() {
  const service = new chrome.ServiceBuilder('/Users/khan/Desktop/Auxious/Auxious-Server/services/chromedriver').build();
  chrome.setDefaultService(service);
  const driver = await new webdriver.Builder()
    .forBrowser('chrome')
    .build();

  await driver.manage().setTimeouts({
    implicit: 10000,
    pageLoad: 30000,
    script: 30000,
  });

  await driver.get('http://www.my-auction.co.kr/auction/search.php');
  const selectRegionMenu = await driver.findElement(By.id('address1_01'));
  await selectRegionMenu.sendKeys('서울특별시');
  const selectForSaleTypeCheckBox = await driver.findElement(By.className('t_color01')).findElement(By.tagName('input'));
  await selectForSaleTypeCheckBox.click();
  const totaSearchButton = await driver.findElement(By.id('search_btn')).findElement(By.tagName('button'));
  await totaSearchButton.click();

  const loginPageButton = await driver.findElement(By.className('logon')).findElement(By.tagName('a'));
  await loginPageButton.click();

  const loginInput = await driver.findElement(By.className('mem_id'));
  await loginInput.sendKeys("vanilla")
  const passwordInput = await driver.findElement(By.className('mem_pw'));
  await passwordInput.sendKeys("asdasd");
  const loginButton = await driver.findElement(By.id('btn_login'));
  await loginButton.click();

  const firstPage = await driver.findElement(By.className('ytb_1st'));
  const firstPageUrl = await firstPage.getAttribute('href');
  await driver.get(firstPageUrl);

  const orderButtonList = await driver.findElement(By.id('sort_btn')).findElement(By.tagName('ul'))
    .findElements(By.tagName('li'));
  const dateOrderButton = await orderButtonList[4].findElements(By.tagName('a'));
  await dateOrderButton[1].click();

  let newUrl = firstPageUrl;
  newUrl = newUrl.replace('page=1', 'page=0');

  for (let i = 1; i < 31; i++) {
    newUrl = newUrl.replace(`page=${i}`, `page=${i + 1}`);
    await driver.get(newUrl);

    const auctionListTable = await driver.findElement(By.className('tbl_auction_list'));
    const auctionList = await auctionListTable.findElements(By.tagName("tr"));
    const auctionBuildingLink = [];
    for (let i = 1; i < auctionList.length; i++) {
      await driver.wait(until.elementLocated(By.tagName('td')), 10000);

      const auctionListDataSells = await auctionList[i].findElements(By.tagName('td'));
      auctionBuildingLink.push(await auctionListDataSells[1].findElement(By.tagName('a')).getAttribute('href'));
    }

    for (let i = 1; i < auctionList.length; i++) {
      await driver.get(auctionBuildingLink[i - 1]);
      const source = await driver.getPageSource();
      await crawlingAuctionDetail(driver);
      await driver.navigate().back();
      i = auctionList.length;
    }
  }

  await driver.close();

}

async function crawlingAuctionDetail(driver) {
  const buildingData = {
  };
  const pictureElement = await driver.findElements(By.id('dtl_pix'));
  const picture = []; // 사진
  for (let i = 0; i < pictureElement.length; i++) {
    picture.push(await pictureElement[i].findElement(By.css('a > img')).getAttribute('src'));
  }

  const auctionNumberElement = await driver.findElement(By.className('blue'));
  const auctionNumber = await auctionNumberElement.getText(); // 경매번호

  const basicInfoElement = await driver.findElement(By.className('tbl_detail'));

  const addressElement = await basicInfoElement.findElement(By.tagName('td'));
  const addressDetail = await addressElement.getText();
  const address = addressDetail.split(',')[0]; //주소

  const buildingTypeElementList = await basicInfoElement.findElements(By.css('tbody > tr'));
  const buildingTypeElement = await buildingTypeElementList[2].findElement(By.tagName('td'));
  let buildingType = await buildingTypeElement.getText(); //빌딩 타입

  switch (buildingType) {
    case '다세대(빌라)' || '다가구':
      buildingType = '다세대/다가구';
      break;
    case '단독주택' || '근린주택':
      buildingType = '주택';
      break;
  };

  const squareMetersElement = await driver.findElement(By.className('pink'));
  const koreanSquareMeters = await squareMetersElement.getText();
  const squareMeters = (parseInt(koreanSquareMeters) * 3.3) + ' ' + koreanSquareMeters; //평

  const connoisseurElementList = await basicInfoElement.findElements(By.className('tdl_right'))
  const connoisseurElement = await connoisseurElementList[0].findElement(By.tagName('strong'));
  const connoisseur = await connoisseurElement.getText(); //감정가

  const lowestPriceElement = await basicInfoElement.findElement(By.className('blue'));
  const lowestPrice = await lowestPriceElement.getText(); //최저가

  const depositElement = await basicInfoElement.findElements(By.className('tdl_right'));
  let deposit = await depositElement[2].getText(); //보증금
  deposit = deposit.split(' ')[1];

  const process = []; //진행 일정
  const processElementTable = await driver.findElement(By.id('plan_toward')).findElement(By.className('tbl_detail'));
  const proccessElementList = await processElementTable.findElements(By.tagName('tr'));
  for (let i = 1; i < proccessElementList.length; i++) {
    const tempProcess = {};
    const processDetailElement = await proccessElementList[i].findElements(By.tagName('td'));
    tempProcess.dayProcess = await processDetailElement[0].getText();
    tempProcess.progress = await processDetailElement[1].getText();
    tempProcess.date = await processDetailElement[2].getText();
    process.push(tempProcess);
  }
  const detailStockList = await driver.findElements(By.id('dtl_stock'));
  const tenants = []; //임차인 현황
  const tenantsElementList = await detailStockList[7].findElements(By.tagName('tr'));

  for (let i = 1; i < tenantsElementList.length; i++) {
    const tempTenants = {};
    const tenantsDetailElement = await tenantsElementList[i].findElements(By.tagName('td'));
    if (tenantsDetailElement.length > 2) {
      tempTenants.tenantName = await tenantsDetailElement[0].getText();
      tempTenants.location = await tenantsDetailElement[1].getText();
      tempTenants.date = await tenantsDetailElement[2].getText();
      tenants.push(tempTenants);
    }
  }

  console.log(tenants);





}

async function saveBuildingData() {

}

module.exports = run;
