import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
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
  const expectedSha = process.env.EXPECTED_SHA;
  if (!/^[a-f0-9]{40}$/.test(expectedSha || '')) throw new Error('EXPECTED_SHA must be a full Git commit SHA');
  const observations = [];
  for (const [name, width, height] of [['desktop', 1440, 1100], ['mobile', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, colorScheme: 'light' });
    const errors = [];
    page.on('response', response => { if (response.status() >= 400) errors.push(response.url()); });
    const url = process.env.LIVE_URL || ('http://127.0.0.1:4173' + base + '/');
    const response = await page.goto(url, { waitUntil: 'networkidle' });
    if (response.status() !== 200) throw new Error('Homepage failed to load');
    await page.locator('#recent-activity').waitFor();
    const versionUrl = new URL('version.txt', url);
    versionUrl.searchParams.set('verification', Date.now().toString());
    const versionResponse = await page.request.get(versionUrl.href, { headers: { 'Cache-Control': 'no-cache' } });
    const actualSha = (await versionResponse.text()).trim();
    const htmlSha = await page.locator('meta[name="build-commit"]').getAttribute('content');
    if (versionResponse.status() !== 200 || actualSha !== expectedSha || htmlSha !== expectedSha) {
      throw new Error(`Version mismatch: expected=${expectedSha}, version.txt=${actualSha}, homepage=${htmlSha}`);
    }
    if (process.env.REQUIRE_ACTIVITY === 'true') {
      const seed = page.getByText('Activity collection has not run yet.', { exact: false });
      if (await seed.count()) throw new Error('Live page still has seed content');
    }
    if (errors.length) throw new Error('Failed resources: ' + errors.join(', '));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    if (overflow) throw new Error(name + ' viewport has horizontal overflow');
    await page.screenshot({ path: 'evidence/' + (process.env.LIVE_URL ? 'live-' : '') + name + '.png', fullPage: true });
    observations.push({ viewport: name, url, status: response.status(), expectedSha, actualSha, htmlSha, horizontalOverflow: overflow });
    await page.close();
  }
  console.log('Desktop/mobile render and overflow checks: PASS');
  await writeFile('evidence/' + (process.env.LIVE_URL ? 'live-' : '') + 'verification.json', JSON.stringify({ capturedAt: new Date().toISOString(), observations }, null, 2));
  console.log(`Version smoke test: PASS (${expectedSha})`);
} finally {
  await browser.close();
  server.close();
}
