import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const root = resolve('_site');
const base = '/devops-pages-lab';
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const relative = pathname.startsWith(base + '/') ? pathname.slice(base.length) : pathname;
    const target = resolve(root, '.' + (relative.endsWith('/') ? relative + 'index.html' : relative));
    if (!target.startsWith(root + sep)) throw new Error('Invalid path');
    const content = await readFile(target);
    res.setHeader('Content-Type', extname(target) === '.css' ? 'text/css' : 'text/html');
    res.end(content);
  } catch { res.writeHead(404); res.end('Not found'); }
});
await new Promise(done => server.listen(4173, '127.0.0.1', done));
const browser = await chromium.launch();
try {
  await mkdir('evidence', { recursive: true });
  for (const [name, width, height] of [['desktop', 1440, 1100], ['mobile', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, colorScheme: 'light' });
    const errors = [];
    page.on('response', response => { if (response.status() >= 400) errors.push(response.url()); });
    const response = await page.goto('http://127.0.0.1:4173' + base + '/', { waitUntil: 'networkidle' });
    if (response.status() !== 200) throw new Error('Homepage failed to load');
    await page.locator('#recent-activity').waitFor();
    if (errors.length) throw new Error('Failed resources: ' + errors.join(', '));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    if (overflow) throw new Error(name + ' viewport has horizontal overflow');
    await page.screenshot({ path: 'evidence/' + name + '.png', fullPage: true });
    await page.close();
  }
  console.log('Desktop/mobile render and overflow checks: PASS');
} finally {
  await browser.close();
  server.close();
}
