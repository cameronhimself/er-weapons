import * as fs from 'fs';
import fetch from 'node-fetch';
import write from 'write';
import * as cheerio from 'cheerio';
import { load as $ } from 'cheerio';
// @ts-ignore
import cheerioTableparser from 'cheerio-tableparser';
import { CACHE_DIR, SCRAPED_FILEPATH, IMAGE_CACHE_DIR } from './constants';
import { ScrapedWeapon } from './types';

const ROOT_URL = 'https://eldenring.wiki.fextralife.com';
const INDEX_URL = `${ROOT_URL}/Weapons+Comparison+Tables`;

type ScrapeFunction<TReturn = string> = ($: cheerio.CheerioAPI) => TReturn;

const normalizeText = (s: string): string => {
  return s.trim().replace(/\u00A0/gm, ' ');
};

const urlToFilename = (url: string): string => {
  return url.replace(/[^a-z0-9]/gi, '_');
};

const loadPageHtml = async (url: string): Promise<string> => {
  const filePath = `${CACHE_DIR}/${urlToFilename(url)}.html`;

  if (!fs.existsSync(filePath)) {
    console.log(`fetching ${url}...`);
    const html = await (await fetch(url)).text();
    write.sync(filePath, html);
  }
  return fs.readFileSync(filePath, 'utf8');
};

const scrapeName: ScrapeFunction = $ => {
  return normalizeText($('#infobox h2').text());
};

const scrapeCategory: ScrapeFunction = $ => {
  return normalizeText($('#infobox tbody tr:nth-child(5) td:first').text());
};

const scrapePhysicalDamageTypes: ScrapeFunction<Array<string>> = $ => {
  return normalizeText($('#infobox tbody tr:nth-child(5) td:last').text()).split(' / ');
};

const scrapeRequiredAttributes: ScrapeFunction<Record<string, string>> = $ => {
  return $('#infobox tbody tr:nth-child(4) td:last .lineleft').text().trim()
    .split('\n')
    .map(normalizeText)
    .filter(Boolean)
    .map(line => line.split(' '))
    .reduce((acc, [k, v]) => ({...acc, [k]: v }), {})
};

const scrapeWeight: ScrapeFunction = $ => {
  return normalizeText($('#infobox tbody tr:nth-child(7) td:first').text())
      .replace('Wgt. ', '')
  ;
};

const scrapeWeaponArt: ScrapeFunction = $ => {
  return normalizeText($('#infobox tbody tr:nth-child(6) td:first').text());
};

const scrapeCritical: ScrapeFunction = $ => {
  const match = normalizeText($('#infobox tbody tr:nth-child(3) td:first').text())
    .match(/Crit (?<critValue>[0-9]{1,3})/);
  return match ? match.groups.critValue : '';
};

const mapInfusionTableData = (data: any) => {
  return data[0].slice(2).reduce((acc: any, _: any, i: number) => {
    return {
      ...acc,
      [i]: {
        guardBoost: data[18][i + 2],
        scaling: {
          strength: data[7][i + 2],
          dexterity: data[8][i + 2],
          intelligence: data[9][i + 2],
          faith: data[10][i + 2],
          arcane: data[11][i + 2],
        },
        attack: {
          physical: data[1][i + 2],
          magic: data[2][i + 2],
          fire: data[3][i + 2],
          lightning: data[4][i + 2],
          holy: data[5][i + 2],
        },
        guard: {
          physical: data[13][i + 2],
          magic: data[14][i + 2],
          fire: data[15][i + 2],
          lightning: data[16][i + 2],
          holy: data[17][i + 2],
        },
        effects: {},
      },
    };
  }, {});
};

const getTableDataByInfusion = ($: cheerio.CheerioAPI, infusion: string) => {
  const th = $(`th:contains('${infusion} +1'):first`);
  if (th.length) {
    const attackTable = th.parentsUntil('table').last().parent().parent();
    const $attackTable = cheerio.load(attackTable.html());
    cheerioTableparser($attackTable);
    // @ts-ignore
    const data = $attackTable('table').parsetable(true, true, true);
    return data;
  }
  return null;
};

const scrapeStats: ScrapeFunction<any> = $ => {
  const tableDataList = {
    standard: getTableDataByInfusion($, 'Standard'),
    heavy: getTableDataByInfusion($, 'Heavy'),
    keen: getTableDataByInfusion($, 'Keen'),
    quality: getTableDataByInfusion($, 'Quality'),
    fire: getTableDataByInfusion($, 'Fire'),
    flame: getTableDataByInfusion($, 'Flame'),
    lightning: getTableDataByInfusion($, 'Lightning'),
    sacred: getTableDataByInfusion($, 'Sacred'),
    magic: getTableDataByInfusion($, 'Magic'),
    cold: getTableDataByInfusion($, 'Cold'),
    poison: getTableDataByInfusion($, 'Poison'),
    blood: getTableDataByInfusion($, 'Blood'),
    occult: getTableDataByInfusion($, 'Occult'),
  };

  return Object.entries(tableDataList).reduce((acc: any, [infusion, data]: any) => {
    return data ? { ...acc, [infusion]: mapInfusionTableData(data) } : acc;
  }, {});
};

const scrapeWeaponData = async (url: string): Promise<any> => {
  const html = await loadPageHtml(url);
  const $root = cheerio.load(html);
  const name = scrapeName($root);
  try {
    return {
      name: scrapeName($root),
      category: scrapeCategory($root),
      physicalDamageTypes: scrapePhysicalDamageTypes($root),
      requiredAttributes: scrapeRequiredAttributes($root),
      weaponArt: scrapeWeaponArt($root),
      weight: scrapeWeight($root),
      critical: scrapeCritical($root),
      stats: scrapeStats($root),
    };
  } catch (e) {
    console.error(`Error scraping ${name}`);
    throw e;
  }
};

const run = async () => {
  const indexPageHtml = await loadPageHtml(INDEX_URL);
  const $index = $(indexPageHtml);
  const promises: Array<Promise<ScrapedWeapon>> = [];
  $index('.wiki_table tbody tr').each((_, tr) => {
    $(tr)('td:first a').each((_, a) => {
      const url = `${ROOT_URL}${a.attribs['href']}`;
      promises.push(scrapeWeaponData(url));
    });
  });
  try {
    const allScraped = await Promise.all(promises);
    write.sync(SCRAPED_FILEPATH, JSON.stringify(allScraped, null, 2));
  } catch (err) {
    console.error(err);
  }
};

run();
