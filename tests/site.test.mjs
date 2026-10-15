import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
const html = readFileSync('index.html', 'utf8');
const css = readFileSync('styles.css', 'utf8');
test('semantic HTML landmarks and navigable anchor', () => {
  assert.match(html, /<html lang="en">/);
  for (const tag of ['header','main','footer']) {
    assert.match(html, new RegExp('<' + tag + '\\b'));
  }
  assert.match(html, /href="#content"/);
  assert.match(html, /id="content"/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
});
test('local image is accessible and exists', () => {
  const match = html.match(/<img\b[^>]+src="([^"]+)"[^>]*>/);
  assert.ok(match);
  assert.match(match[0], /alt="[^"]+"/);
  assert.ok(existsSync(resolve(match[1])));
});
test('five movies and five places remain in lists', () => {
  const ol = html.match(/<ol>([\s\S]*?)<\/ol>/)?.[1] || '';
  const ul = html.match(/<ul>([\s\S]*?)<\/ul>/)?.[1] || '';
  assert.equal((ol.match(/<li>/g) || []).length, 5);
  assert.equal((ul.match(/<li>/g) || []).length, 5);
});
test('focus styling is visible', () => {
  assert.match(css, /:focus-visible/);
});
