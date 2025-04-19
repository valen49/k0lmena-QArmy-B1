import dotenv from 'dotenv';
dotenv.config();

import axios, { AxiosResponse } from 'axios';
import * as cheerio from 'cheerio';
import { URL } from 'url';

// Resource types
type ResourceType = 'link' | 'image';
interface Resource {
  url: string;
  type: ResourceType;
}

/**
 * Fetches HTML content of a page.
 */
async function fetchHTML(pageUrl: string): Promise<string> {
  const response: AxiosResponse<string> = await axios.get(pageUrl, {
    responseType: 'text',
    headers: { 'User-Agent': 'k0lmena-link-tester/1.0' },
  });
  return response.data;
}

/**
 * Extracts all HTTP(S) links and image sources from HTML, ignoring data URIs.
 */
function extractResources(html: string, baseUrl: string): Resource[] {
  const $ = cheerio.load(html);
  const resources: Resource[] = [];

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (href && !href.startsWith('data:')) {
      try {
        const resolved = new URL(href, baseUrl).toString();
        resources.push({ url: resolved, type: 'link' });
      } catch {}
    }
  });

  $('img[src]').each((_, el) => {
    const src = $(el).attr('src');
    if (src && !src.startsWith('data:')) {
      try {
        const resolved = new URL(src, baseUrl).toString();
        resources.push({ url: resolved, type: 'image' });
      } catch {}
    }
  });

  return resources;
}

/**
 * Checks the HTTP status code for a URL.
 */
async function getStatusCode(resourceUrl: string): Promise<number | null> {
  try {
    const resp = await axios.head(resourceUrl, {
      timeout: 5000,
      maxRedirects: 5,
      headers: { 'User-Agent': 'k0lmena-link-tester/1.0' },
    });
    return resp.status;
  } catch (err: any) {
    const status = err.response?.status;
    if (status && status !== 405) {
      return status;
    }
  }

  try {
    const resp = await axios.get(resourceUrl, {
      timeout: 5000,
      maxRedirects: 5,
      responseType: 'stream',
      headers: { 'User-Agent': 'k0lmena-link-tester/1.0' },
    });
    return resp.status;
  } catch (err: any) {
    return err.response?.status ?? null;
  }
}

/**
 * Verifies an image URL has correct content-type header.
 */
async function isImageValid(imageUrl: string): Promise<boolean> {
  try {
    const resp = await axios.head(imageUrl, {
      timeout: 5000,
      headers: { 'User-Agent': 'k0lmena-link-tester/1.0' },
    });
    const ct = resp.headers['content-type'] || '';
    return ct.startsWith('image/');
  } catch {
    return false;
  }
}

/**
 * Tests all links and images on a page and prints summary and broken resources.
 */
export async function testPageResources(pageUrl: string): Promise<void> {
  console.log(`Escaneando: ${pageUrl}`);
  const html = await fetchHTML(pageUrl);
  const resources = extractResources(html, pageUrl);

  const totalLinks = resources.filter(r => r.type === 'link').length;
  const totalImages = resources.filter(r => r.type === 'image').length;
  console.log(`Se encontraron ${totalLinks} links y ${totalImages} imagenes.`);

  const results = await Promise.all(
    resources.map(async ({ url, type }) => {
      const status = await getStatusCode(url);
      let valid = true;

      // Treat HTTP errors 400, 404, >=500 as broken
      if (status === 400 || status === 404 || (status !== null && status >= 500)) {
        valid = false;
      }

      // For images, also verify content-type
      if (type === 'image' && valid) {
        const imgOk = await isImageValid(url);
        if (!imgOk) valid = false;
      }

      return { url, type, status, valid };
    })
  );

  const brokenLinks = results.filter(r => r.type === 'link' && !r.valid);
  const brokenImages = results.filter(r => r.type === 'image' && !r.valid);

  console.log(`Links Rotos: ${brokenLinks.length}`);
  brokenLinks.forEach(r => console.log(`- ${r.url} (Estado: ${r.status})`));

  console.log(`Imagenes Rotas: ${brokenImages.length}`);
  brokenImages.forEach(r => console.log(`- ${r.url} (Estado: ${r.status})`));
}

async function main() {
  const baseUrl = process.env.BASEURL;
  if (!baseUrl) {
    console.error('Error: No hay una BASEURL definida en tu .env');
    process.exit(1);
  }
  try {
    await testPageResources(baseUrl);
  } catch (err: any) {
    console.error(`Error al testear la URL ${baseUrl}: ${err.message}`);
  }
}

if (require.main === module) {
  main();
}
