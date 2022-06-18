const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { By, until } = require('selenium-webdriver');

const Building = require('../model/Building');

const { getCoordsFromAddress } = require('../utils/helpers');

async function runAuctionCrawling() {
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

  await connectSetAuctionSearchOptions(driver);
  await loginAuctionPage(driver);
  await autoSearchNextPage(driver);
  await driver.close();
}

async function autoSearchNextPage(driver) {
  const firstPage = await driver.findElement(By.className('ytb_1st'));
  const firstPageUrl = await firstPage.getAttribute('href');

  await driver.get(firstPageUrl);

  const orderButtonList = await driver
    .findElement(By.id('sort_btn'))
    .findElement(By.tagName('ul'))
    .findElements(By.tagName('li'));

  const dateOrderButton = await orderButtonList[4].findElements(
    By.tagName('a'),
  );

  await dateOrderButton[1].click();

  let newUrl = firstPageUrl;
  let i = 0;

  const newOrderButtonList = await driver
    .findElement(By.id('sort_btn'))
    .findElement(By.tagName('ul'))
    .findElements(By.tagName('li'));

  const newDateOrderButton = await newOrderButtonList[4].findElements(
    By.tagName('a'),
  );
  await newDateOrderButton[1].click();
  while (true) {
    newUrl = newUrl.replace(`page=${i}`, `page=${i + 1}`);
    // if (driver.getCurrentUrl().toString().includes('kuipernet')) return 'stop';

    const result = await connectToAuctionDetailPage(driver);

    // if (result === 'stop') return 'stop';
    i++;

    await driver.get(newUrl);
  }
}

async function connectToAuctionDetailPage(driver) {
  const auctionListTable = await driver.findElement(
    By.className('tbl_auction_list'),
  );

  const auctionList = await auctionListTable.findElements(By.tagName('tr'));
  const auctionBuildingLink = [];

  for (let i = 1; i < auctionList.length; i++) {
    await driver.wait(until.elementLocated(By.tagName('td')), 10000);

    const auctionListDataSells = await auctionList[i].findElements(
      By.tagName('td'),
    );

    auctionBuildingLink.push(
      await auctionListDataSells[1]
        .findElement(By.tagName('a'))
        .getAttribute('href'),
    );
  }

  for (let i = 1; i < auctionList.length; i++) {
    await driver.get(auctionBuildingLink[i - 1]);
    const result = await crawlingAuctionDetail(driver);
    if (result === 'stop') return 'stop';

    await driver.navigate().back();
  }
}

async function loginAuctionPage(driver) {
  const loginPageButton = await driver
    .findElement(By.className('logon'))
    .findElement(By.tagName('a'));

  await loginPageButton.click();

  const id = process.env.AUCTION_ID;
  const pw = process.env.AUCTION_PW;

  const loginInput = await driver.findElement(By.className('mem_id'));
  await loginInput.sendKeys(id);

  const passwordInput = await driver.findElement(By.className('mem_pw'));
  await passwordInput.sendKeys(pw);

  const loginButton = await driver.findElement(By.id('btn_login'));
  await loginButton.click();
}

async function connectSetAuctionSearchOptions(driver) {
  await driver.get(process.env.WEB_PATH);

  const selectRegionMenu = await driver.findElement(By.id('address1_01'));
  await selectRegionMenu.sendKeys('서울특별시');

  const selectForSaleTypeCheckBox = await driver
    .findElement(By.className('t_color01'))
    .findElement(By.tagName('input'));

  await selectForSaleTypeCheckBox.click();

  const totaSearchButton = await driver
    .findElement(By.id('search_btn'))
    .findElement(By.tagName('button'));

  await totaSearchButton.click();
}

async function crawlingAuctionDetail(driver) {
  const auctionNumber = await getAuctionNumber(driver);
  const squareMeters = await getSquarMetersInfo(driver);
  const picture = await getImgInfo(driver);
  const process = await getProcessInfo(driver);

  const [address, buildingType, connoisseur, lowestPrice, deposit] =
    await getBasicInfo(driver);

  const [appraisal, caution, tenants] = await getDetailInfo(driver);

  const point = await getCoordsFromAddress(address);

  const coords = {
    type: 'Point',
    coordinates: point,
  };

  const buildingData = {
    appraisal,
    caution,
    tenants,
    process,
    deposit,
    lowestPrice,
    connoisseur,
    squareMeters,
    buildingType,
    address,
    auctionNumber,
    picture,
    coords,
  };

  const result = await saveBuildingData(buildingData, driver);
  if (result === 'stop') return 'stop';
}

async function getAuctionNumber(driver) {
  const auctionNumberElement = await driver.findElement(By.className('blue'));
  const auctionNumber = await auctionNumberElement.getText();

  return auctionNumber;
}

async function getSquarMetersInfo(driver) {
  try {
    const squareMetersElement = await driver.findElement(By.className('pink'));
    const koreanSquareMeters = await squareMetersElement.getText();

    const squareMeters =
      parseInt(koreanSquareMeters) * 3.3 + ' ' + koreanSquareMeters;

    return squareMeters;
  } catch {
    const squareMeters = '333';
    return squareMeters;
  }
}
async function getProcessInfo(driver) {
  const process = [];

  const processElementTable = await driver
    .findElement(By.id('plan_toward'))
    .findElement(By.className('tbl_detail'));

  const proccessElementList = await processElementTable.findElements(
    By.tagName('tr'),
  );

  for (let i = 1; i < proccessElementList.length; i++) {
    const tempProcess = {};

    const processDetailElement = await proccessElementList[i].findElements(
      By.tagName('td'),
    );

    tempProcess.dayProcess = await processDetailElement[0].getText();
    tempProcess.progress = await processDetailElement[1].getText();
    tempProcess.date = await processDetailElement[2].getText();

    process.push(tempProcess);
  }

  return process;
}

async function getImgInfo(driver) {
  const pictureElement = await driver.findElements(By.id('dtl_pix'));
  const picture = [];

  for (let i = 0; i < pictureElement.length; i++) {
    picture.push(
      await pictureElement[i]
        .findElement(By.css('a > img'))
        .getAttribute('src'),
    );
  }

  return picture;
}

async function getBasicInfo(driver) {
  let address = '';
  let buildingType = '';
  let connoisseur = '';
  let lowestPrice = '';
  let deposit = '';

  const basicInfoElement = await driver.findElement(By.className('tbl_detail'));

  const basicInfoTrTagList = await basicInfoElement.findElements(
    By.tagName('tr'),
  );

  for (let i = 0; i < basicInfoTrTagList.length; i++) {
    const basicInfoTitleElement = await basicInfoTrTagList[i].findElements(
      By.tagName('th'),
    );
    for (let j = 0; j < basicInfoTitleElement.length; j++) {
      const basicInfoTitle = await basicInfoTitleElement[j].getText();

      switch (basicInfoTitle) {
        case '소재지':
          const addressElement = await basicInfoTitleElement[j].findElement(
            By.xpath('following-sibling::*'),
          );

          address = await addressElement.getText();
          address = address.split(',')[0];
          let tempAddress = address.split(' ');

          address = tempAddress[0];

          for (let i = 1; i < 4; i++) {
            address += ' ' + tempAddress[i];
          }

          break;
        case '물건종류':
          const buildingTypeElement = await basicInfoTitleElement[
            j
          ].findElement(By.xpath('following-sibling::*'));

          buildingType = await buildingTypeElement.getText();

          if (
            buildingType === '다세대(빌라)' ||
            buildingType === '다가구' ||
            buildingType === '다가구(원룸등)'
          ) {
            buildingType = '다세대/다가구';
          } else if (buildingType === '주택' || buildingType === '근린주택') {
            buildingType = '주택';
          } else if (buildingType === '아파트') {
            buildingType = '아파트';
          } else if (buildingType === '오피스텔') {
            buildingType = '오피스텔/원룸';
          }

          break;
        case '감정가':
          const connoisseurElement = await basicInfoTitleElement[j].findElement(
            By.xpath('following-sibling::*'),
          );

          connoisseur = await connoisseurElement.getText();

          break;
        case '최저가':
          const lowestPriceElement = await basicInfoTitleElement[j].findElement(
            By.xpath('following-sibling::*'),
          );

          lowestPrice = await lowestPriceElement.getText();

          break;
        case '입찰보증금':
          const depositElement = await basicInfoTitleElement[j].findElement(
            By.xpath('following-sibling::*'),
          );
          deposit = await depositElement.getText();

          break;
      }
    }
  }

  return [address, buildingType, connoisseur, lowestPrice, deposit];
}

async function getDetailInfo(driver) {
  let tenants = [];
  let caution = '';
  let appraisal = '';
  const detailStockList = await driver.findElements(By.id('dtl_stock'));

  for (let i = 0; i < detailStockList.length; i++) {
    const detailStockListTitleElement = await detailStockList[i].findElement(
      By.tagName('h3'),
    );

    const detailStockListTitle = await detailStockListTitleElement.getText();

    switch (detailStockListTitle) {
      case '임차인현황':
        const tempTenants = {};
        const tenantsElementList = await detailStockList[i].findElements(
          By.tagName('tr'),
        );

        for (let i = 1; i < tenantsElementList.length; i++) {
          const tenantsDetailElement = await tenantsElementList[i].findElements(
            By.tagName('td'),
          );

          if (tenantsDetailElement.length > 2) {
            tempTenants.tenantName = await tenantsDetailElement[0].getText();
            tempTenants.location = await tenantsDetailElement[1].getText();
            tempTenants.date = await tenantsDetailElement[2].getText();
            tenants.push(tempTenants);
          }
        }

        break;
      case '주의사항':
        const cautionList = await detailStockList[i].findElements(
          By.css('#nojum > ul > li'),
        );

        for (let j = 0; j < cautionList.length; j++) {
          caution += (await cautionList[j].getText()) + '\n';
        }

        break;
      case '감정평가현황':
        try {
          const appraisalElement = await detailStockList[i].findElement(
            By.id('jraw'),
          );

          appraisal = await appraisalElement.getText();
        } catch {
          continue;
        }
    }
  }

  return [appraisal, caution, tenants];
}

async function saveBuildingData(buildingData, driver) {
  // const origin = await Building.findOne({
  //   auctionNumber: buildingData.auctionNumber,
  // });
  // if (!origin) {
  // const building = new Building(buildingData);
  // await building.save();
  // } else {
  // return 'stop';
  // }
}

module.exports = runAuctionCrawling;
