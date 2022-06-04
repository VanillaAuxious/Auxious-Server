const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { By, Key } = require('selenium-webdriver');

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

  const orderButtonList = await driver.findElement(By.id('sort_btn')).findElement(By.tagName('ul'))
    .findElements(By.tagName('li'));
  const dateOrderButton = await orderButtonList[4].findElements(By.tagName('a'));
  await dateOrderButton[1].click();

  const auctionListTable = await driver.findElement(By.className('tbl_auction_list'));
  const auctionListBody = await auctionListTable.findElement(By.tagName('tbody'));
  const auctionList = await auctionListTable.findElements(By.tagName("tr"));

  const auctionListDataSells = await auctionList[1].findElements(By.tagName('td'));
  const auctionBuildingLink = await auctionListDataSells[1].findElement(By.tagName('a'));
  await auctionBuildingLink.click();

  const buildingData = {};

}

module.exports = run;
