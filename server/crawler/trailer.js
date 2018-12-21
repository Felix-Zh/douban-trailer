import template from 'lodash/template';
import puppeteer from 'puppeteer';
import { sleep } from '../utils';


const url = 'https://movie.douban.com/subject/<%= id %>';

export default async function main(id) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const targetURL = template(url)({ id });

  console.log('爬虫初始化完成...');
  console.log(`正在前往页面 ${targetURL} ...`);
  await page.goto(targetURL, { waitUntil: 'networkidle2' });
  console.log('页面加载完成...');
  await sleep(1000);

  const { cover, trailerPageURL } = await page.evaluate(() => {
    const $linkEl = window.$('.label-trailer > .related-pic-video');
    const rCover = /background-image:url\((.*)\)/;
    const coverMatch = $linkEl.attr('style').match(rCover);

    return {
      cover: coverMatch ? coverMatch[1] : '',
      trailerPageURL: $linkEl.attr('href')
    };
  });

  if (!trailerPageURL) {
    return console.log('未找到预告片...');
  }

  console.log(`抓取到预告片页链接 ${trailerPageURL} ...`);
  console.log(`正在前往页面 ${trailerPageURL} ...`);
  await page.goto(trailerPageURL, { waitUntil: 'networkidle2' });
  console.log('页面加载完成...');
  await sleep(1000);

  const src = await page.evaluate(() => {
    return window.$('#movie_player source').attr('src');
  })

  await browser.close();

  process.send({ id, cover, src });
}

main(process.argv[2]);
