import puppeteer from 'puppeteer';
import { isEmpty } from 'radashi';
import 'dotenv/config';

import { log, payload } from './common';
import db from './db';

async function main() {
  try {
    if (isEmpty(payload.url) || isEmpty(payload.filename)) {
      throw new Error('URL and filename are required');
    } else {
      const shot = await takeScreenshot(payload.url as string);

      if (shot) {
        log.info('Screenshot taken:', payload.url as string);
        const record = await db.collection('screenshots').create({
          screenshot: new File([shot], payload.filename as string),
        });
        log.info('Screenshot uploaded:', record);
      }
    }
  } catch (err) {
    log.error((err as Error).message);
  }
}

async function takeScreenshot(url: string): Promise<Uint8Array<ArrayBufferLike> | undefined> {
  const browser = await puppeteer.launch({
    args: ['--disable-web-security', '--allow-running-insecure-content'],
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.setViewport({ height: 1420, width: 1280 });
    const shot = await page.screenshot({
      fullPage: true,
      type: 'png',
    });
    await page.close();
    return shot;
  } catch (error) {
    log.error((error as Error).message);
    return undefined;
  } finally {
    await browser.close();
  }
}

main();
