import puppeteer from 'puppeteer';
import { TimeoutError } from 'puppeteer/Errors';
import { sleep, getRandomInt } from '../utils';


const url = 'https://movie.douban.com/tag/#/?sort=U&range=8,10&tags=电影,2010年代';
const itemSelector = '.list-wp .item';

async function main() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  console.log('爬虫初始化完成...');
  console.log(`正在前往页面 ${url} ...`);
  await page.goto(url, { waitUntil: 'networkidle2' });
  console.log('页面加载完成...');
  await sleep(1000);
  await loadMore(page, 1);

  const result = await collectData(page);

  await browser.close();

  process.send(result.slice(0, 3));
}

async function loadMore(page, times) {
  const getItemLength = async () => (await page.$$(itemSelector)).length;

  try {
    await page.waitForSelector('.more');
  } catch (err) {
    if (err instanceof TimeoutError) {
      console.log('Timeout on selecting \'more button\', seems like there is only one page.');
    } else {
      throw err;
    }
  }

  console.log('开始加载更多页面...');

  let idx = 0;
  let lastLength = 0;
  let currLength = 0;
  let newLength = 0;
  let statusText = '';

  for (let i = 0; i < times; i += 1) {
    idx = i + 1;
    lastLength = await getItemLength();

    console.log(`开始进行第 ${idx} 次加载...`);
    await page.evaluate(() => window.$('.more').get(0).click());
    await page.waitForFunction(
      (lastLength, itemSelector) => window.$(itemSelector).length !== lastLength,
      {}, lastLength, itemSelector
    );

    currLength = await getItemLength();
    newLength = currLength - lastLength;
    statusText = `第 ${idx} 次加载完成，新增 ${newLength} 个条目。`;

    if (await page.$('.more')) {
      const delay = getRandomInt(100, 500);
      const hasMoreLoop = i !== times - 1;

      console.log(`${statusText}${hasMoreLoop ? `下次加载将在 ${delay}ms 后进行...` : ''}`);

      if (hasMoreLoop) await sleep(delay);
    } else {
      console.log(statusText);
      break;
    }

  }

  console.log(`所有数据加载完成，总计加载 ${idx} 次，获得数据 ${currLength} 条。`);
}

async function collectData(page) {
  return await page.evaluate(itemSelector => {
    const $items = window.$(itemSelector);

    return Array.from($items.map((idx, item) => {
      const $item = $(item);
      const coverThumbURL = $item.find('.pic > img').attr('src');

      return {
        id: $item.find('.cover-wp').data('id'),
        title: $item.find('.title').text(),
        rate: Number($item.find('.rate').text()),
        coverURL: coverThumbURL.replace('s_ratio_poster', 'l_ratio_poster'),
        coverThumbURL,
      };
    }));
  }, itemSelector);
}

main();
