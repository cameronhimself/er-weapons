import * as fs from 'fs';
import * as write from 'write';
import { OUTPUT_DIR, SCRAPED_FILEPATH } from './constants';
import { ScrapedWeapon, ScrapedWeaponStats } from './types';
import { SCALING_MAP } from '../../src/constants';
import {
  AttributeKey,
  PhysicalDamageTypeKey,
  Weapon,
  WeaponCategoryKey,
  WeaponStats,
} from '../../src/types';
import { invert } from '../../src/utils';

const scalingMap = invert(SCALING_MAP) as unknown as Record<string, number>;

const categoryKeyMap: Record<string, WeaponCategoryKey> = {
  'Dagger': 'dagger',
  'Straight Sword': 'straightSword',
  'Greatsword': 'greatsword',
  'Colossal Sword': 'colossalSword',
  'Thrusting Sword': 'thrustingSword',
  'Heavy Thrusting Sword': 'heavyThrustingSword',
  'Curved Sword': 'curvedSword',
  'Curved Greatsword': 'curvedGreatsword',
  'Katana': 'katana',
  'Twinblade': 'twinblade',
  'Axe': 'axe',
  'Greataxe': 'greataxe',
  'Hammer': 'hammer',
  'Flail': 'flail',
  'Great Hammer': 'greatHammer',
  'Colossal Weapon': 'colossalWeapon',
  'Spear': 'spear',
  'Great Spear': 'greatSpear',
  'Halberd': 'halberd',
  'Reaper': 'reaper',
  'Whip': 'whip',
  'Fist': 'fist',
  'Claw': 'claw',
  'Light Bow': 'lightBow',
  'Bow': 'bow',
  'Greatbow': 'greatbow',
  'Crossbow': 'crossbow',
  'Ballista': 'ballista',
  'Glintstone Staff': 'glintstoneStaff',
  'Sacred Seal': 'sacredSeal',
  'Torch': 'torch',
};

const physicalDamageTypeKeyMap: Record<string, PhysicalDamageTypeKey> = {
  Standard: 'standard',
  Strike: 'strike',
  Slash: 'slash',
  Pierce: 'pierce',
};

const attributeKeyMap: Record<string, AttributeKey> = {
  Str: 'strength',
  Dex: 'dexterity',
  Int: 'intelligence',
  Fai: 'faith',
  Arc: 'arcane',
};

const stringToNumber = (str: string): number => {
  return Number(str) || 0;
};

const loadJson = (): Array<ScrapedWeapon> => {
  if (!fs.existsSync(SCRAPED_FILEPATH)) {
    throw new Error('Scraped data file does not exist; run scrape first.');
  }
  return JSON.parse(fs.readFileSync(SCRAPED_FILEPATH, 'utf8'));
};

const scalingFromScraped = (scaling: string) => {
  return Object.keys(scalingMap).includes(scaling) ? Number(scalingMap[scaling]) : 0;
};

const statsFromScraped = (scrapedStats: Array<ScrapedWeaponStats>): Array<WeaponStats> => {
  return scrapedStats.map((scrapedStats) => {
    const { attack, guard, castingScaling, scaling } = scrapedStats;
    const stats: WeaponStats = {
      guardBoost: Number(scrapedStats.guardBoost),
      castingScaling: castingScaling
        ? [Number(castingScaling[0]), Number(castingScaling[1])]
        : null,
      scaling: {
        strength: scalingFromScraped(scaling.strength),
        dexterity:scalingFromScraped(scaling.dexterity),
        intelligence: scalingFromScraped(scaling.intelligence),
        faith: scalingFromScraped(scaling.faith),
        arcane: scalingFromScraped(scaling.arcane),
      },
      attack: {
        physical: stringToNumber(attack.physical),
        magic: stringToNumber(attack.magic),
        fire: stringToNumber(attack.fire),
        lightning: stringToNumber(attack.lightning),
        holy: stringToNumber(attack.holy),
      },
      guard: {
        physical: stringToNumber(guard.physical),
        magic: stringToNumber(guard.magic),
        fire: stringToNumber(guard.fire),
        lightning: stringToNumber(guard.lightning),
        holy: stringToNumber(guard.holy),
      },
      effects: {
        bleed: 0,
        frost: 0,
        poison: 0,
        deadlyPoison: 0,
        rot: 0,
        sleep: 0,
        madness: 0,
        death: 0,
      },
    };
    return stats;
  });
};

const weaponFromScraped = (scraped: ScrapedWeapon): Weapon => {
  const maxUpgradeLevel = Object.keys(scraped.stats.standard).length - 1;
  const infusions = Object.keys(scraped.stats);
  return {
    name: scraped.name,
    category: categoryKeyMap[scraped.category],
    physicalDamageTypes: scraped.physicalDamageTypes.map(type => physicalDamageTypeKeyMap[type]),
    upgradeType: maxUpgradeLevel > 10 ? 'standard' : 'somber',
    infusable: infusions.length > 1,
    weaponArt: 'bladeOfGold', // todo
    weight: stringToNumber(scraped.weight),
    critical: stringToNumber(scraped.critical),
    requiredAttributes: Object.entries(scraped.requiredAttributes).reduce((acc, [key, value]) => {
      return { ...acc, [attributeKeyMap[key]]: Number(value) };
    }, {} as Record<AttributeKey, number>),
    stats: {
      standard: statsFromScraped(scraped.stats.standard),
      ...(scraped.stats.heavy ? { heavy: statsFromScraped(scraped.stats.heavy) } : {}),
      ...(scraped.stats.keen ? { keen: statsFromScraped(scraped.stats.keen) } : {}),
      ...(scraped.stats.quality ? { quality: statsFromScraped(scraped.stats.quality) } : {}),
      ...(scraped.stats.fire ? { fire: statsFromScraped(scraped.stats.fire) } : {}),
      ...(scraped.stats.flame ? { flame: statsFromScraped(scraped.stats.flame) } : {}),
      ...(scraped.stats.lightning ? { lightning: statsFromScraped(scraped.stats.lightning) } : {}),
      ...(scraped.stats.sacred ? { sacred: statsFromScraped(scraped.stats.sacred) } : {}),
      ...(scraped.stats.magic ? { magic: statsFromScraped(scraped.stats.magic) } : {}),
      ...(scraped.stats.cold ? { cold: statsFromScraped(scraped.stats.cold) } : {}),
      ...(scraped.stats.poison ? { poison: statsFromScraped(scraped.stats.poison) } : {}),
      ...(scraped.stats.blood ? { poison: statsFromScraped(scraped.stats.blood) } : {}),
      ...(scraped.stats.occult ? { occult: statsFromScraped(scraped.stats.occult) } : {}),
    }
  };
};

const run = () => {
  const scraped = loadJson();
  const weapons = scraped.map(weaponFromScraped);
  write.sync(`${OUTPUT_DIR}/weapons.json`, JSON.stringify(weapons, null, 2));
};

run();
