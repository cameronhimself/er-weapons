import * as fs from 'fs';
import fetch from 'node-fetch';
import write from 'write';
import * as cheerio from 'cheerio';
import { load as $ } from 'cheerio';
// @ts-ignore
import cheerioTableparser from 'cheerio-tableparser';
import { CACHE_DIR, SCRAPED_FILEPATH } from './constants';
import { ScrapedWeapon } from './types';

const ROOT_URL = 'https://eldenring.wiki.fextralife.com';
const INDEX_URL = `${ROOT_URL}/Weapons+Comparison+Tables`;

type ScrapeFunction<TReturn = string> = ($: cheerio.CheerioAPI, weaponName?: string) => TReturn;

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
  return normalizeText($('#breadcrumbs-container > a:last').text());
};

const scrapePhysicalDamageTypes: ScrapeFunction<Array<string>> = $ => {
  return normalizeText($('#infobox tbody tr:nth-child(5) td:last').text())
    .split('/')
    .map(s => s.trim())
    .filter(s => s.toLowerCase() !== 'none')
    .filter(Boolean)
  ;
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

const mapInfusionTableData = (data: Array<Array<string>>) => {
  const columnIndices = {
    guardBoost: data.findIndex(([section, key]) => section.includes('Damage Reduction') && key === 'Bst'),
    castingScaling: data.findIndex(([section, key]) => section.includes('Attack Power') && (key.includes('Sor Scaling') || key.includes('Inc Scaling'))),
    scaling: {
      strength: data.findIndex(([section, key]) => section === 'Stat Scaling' && key === 'Str'),
      dexterity: data.findIndex(([section, key]) => section === 'Stat Scaling' && key === 'Dex'),
      intelligence: data.findIndex(([section, key]) => section === 'Stat Scaling' && key === 'Int'),
      faith: data.findIndex(([section, key]) => section === 'Stat Scaling' && key === 'Fai'),
      arcane: data.findIndex(([section, key]) => section === 'Stat Scaling' && key === 'Arc'),
    },
    attack: {
      physical: data.findIndex(([section, key]) => section.includes('Attack Power') && key === 'Phy'),
      magic: data.findIndex(([section, key]) => section.includes('Attack Power') && key === 'Mag'),
      fire: data.findIndex(([section, key]) => section.includes('Attack Power') && key === 'Fir'),
      lightning: data.findIndex(([section, key]) => section.includes('Attack Power') && key === 'Lit'),
      holy: data.findIndex(([section, key]) => section.includes('Attack Power') && key === 'Hol'),
    },
    guard: {
      physical: data.findIndex(([section, key]) => section.includes('Damage Reduction') && key === 'Phy'),
      magic: data.findIndex(([section, key]) => section.includes('Damage Reduction') && key === 'Mag'),
      fire: data.findIndex(([section, key]) => section.includes('Damage Reduction') && key === 'Fir'),
      lightning: data.findIndex(([section, key]) => section.includes('Damage Reduction') && key === 'Lit'),
      holy: data.findIndex(([section, key]) => section.includes('Damage Reduction') && key === 'Hol'),
    },
  };

  return data[0].slice(2).map((_, i) => {
    const rowIndex = i + 2;
    return {
      castingScaling: columnIndices.castingScaling === -1 ? null : data[columnIndices.castingScaling][rowIndex].split(' - '),
      guardBoost: data[columnIndices.guardBoost][rowIndex],
      scaling: {
        strength: data[columnIndices.scaling.strength][rowIndex],
        dexterity: data[columnIndices.scaling.dexterity][rowIndex],
        intelligence: data[columnIndices.scaling.intelligence][rowIndex],
        faith: data[columnIndices.scaling.faith][rowIndex],
        arcane: data[columnIndices.scaling.arcane][rowIndex],
      },
      attack: {
        physical: data[columnIndices.attack.physical][rowIndex],
        magic: data[columnIndices.attack.magic][rowIndex],
        fire: data[columnIndices.attack.fire][rowIndex],
        lightning: data[columnIndices.attack.lightning][rowIndex],
        holy: data[columnIndices.attack.holy][rowIndex],
      },
      guard: {
        physical: data[columnIndices.guard.physical][rowIndex],
        magic: data[columnIndices.guard.magic][rowIndex],
        fire: data[columnIndices.guard.fire][rowIndex],
        lightning: data[columnIndices.guard.lightning][rowIndex],
        holy: data[columnIndices.guard.holy][rowIndex],
      },
      effects: {
        bleed: '',
        frost: '',
        poison: '',
        rot: '',
        sleep: '',
        madness: '',
        death: '',
      },
    };
  });
};

const getTableDataByInfusion = ($: cheerio.CheerioAPI, infusion: string) => {
  const tableHtmlAttempts: Array<() => string | void> = [
    () => {
      let th = $(`th:contains(${infusion}+1)`);
      if (!th.length) {
        th = $(`th:contains(${infusion} +1)`);
      };
      if (th.length) {
        return th.parentsUntil('.table-responsive').last().parent().html();
      }
    },
    () => {
      let heading = $(`h3:contains( ${infusion} Upgrades)`);
      if (!heading.length) {
        heading = $(`h3:contains( ${infusion.toLowerCase()} Upgrades)`)
      }
      if (heading.length) {
        return heading.nextUntil('.table-responsive').last().next().html();
      }
    },
  ];

  let tableHtml: string | void;
  tableHtmlAttempts.find(fn => tableHtml = fn());
  if (tableHtml) {
    const $attackTable = cheerio.load(tableHtml);
    cheerioTableparser($attackTable);
    // @ts-ignore
    const data = $attackTable('table').parsetable(true, true, true);
    return data;
  }
  return null;
};

const scrapeInfusions: ScrapeFunction<ScrapedWeapon['infusions']> = $ => {
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

const scrapeWeaponData = async (url: string): Promise<ScrapedWeapon> => {
  const html = await loadPageHtml(url);
  const $root = cheerio.load(html);
  const name = scrapeName($root);
  console.log(`Scraping ${name}...`);
  try {
    return {
      name: scrapeName($root),
      wikiUrl: url,
      category: scrapeCategory($root),
      physicalDamageTypes: scrapePhysicalDamageTypes($root),
      requiredAttributes: scrapeRequiredAttributes($root),
      weaponArt: scrapeWeaponArt($root),
      weight: scrapeWeight($root),
      critical: scrapeCritical($root),
      infusions: scrapeInfusions($root),
    };
  } catch (e) {
    console.error(`Error scraping ${name}`);
    console.error(e);
  }
};

const run = async () => {
  const indexPageHtml = await loadPageHtml(INDEX_URL);
  const $index = $(indexPageHtml);
  const promises: Array<Promise<ScrapedWeapon>> = [];
  const whitelist: Array<string> = [];
  const limit = 0;
  $index('.wiki_table tbody tr').each((_, tr) => {
    $(tr)('td:first a').each((_, a) => {
      const name = normalizeText($(a).text());
      const url = `${ROOT_URL}${a.attribs['href']}`;
      if (limit && promises.length >= limit) {
        return;
      }
      if (whitelist.length && !whitelist.includes(name)) {
        return;
      }
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
