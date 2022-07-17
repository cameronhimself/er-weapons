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
  WeaponInfusionStats,
} from '../../src/types';
import { invert } from '../../src/utils';

const scalingMap = invert(SCALING_MAP) as unknown as Record<string, number>;

const categoryKeyMap: Record<string, WeaponCategoryKey> = {
  'Dagger': 'dagger',
  'Daggers': 'dagger',
  'Straight Sword': 'straightSword',
  'Straight Swords': 'straightSword',
  'Greatsword': 'greatsword',
  'Greatswords': 'greatsword',
  'Colossal Sword': 'colossalSword',
  'Colossal Swords': 'colossalSword',
  'Thrusting Sword': 'thrustingSword',
  'Thrusting Swords': 'thrustingSword',
  'Heavy Thrusting Sword': 'heavyThrustingSword',
  'Heavy Thrusting Swords': 'heavyThrustingSword',
  'Curved Sword': 'curvedSword',
  'Curved Swords': 'curvedSword',
  'Curved Greatsword': 'curvedGreatsword',
  'Curved Greatswords': 'curvedGreatsword',
  'Katana': 'katana',
  'Katanas': 'katana',
  'Twinblade': 'twinblade',
  'Twinblades': 'twinblade',
  'Axe': 'axe',
  'Axes': 'axe',
  'Greataxe': 'greataxe',
  'Greataxes': 'greataxe',
  'Hammer': 'hammer',
  'Hammers': 'hammer',
  'Flail': 'flail',
  'Flails': 'flail',
  'Great Hammer': 'greatHammer',
  'Great Hammers': 'greatHammer',
  'Colossal Weapon': 'colossalWeapon',
  'Colossal Weapons': 'colossalWeapon',
  'Spear': 'spear',
  'Spears': 'spear',
  'Great Spear': 'greatSpear',
  'Great Spears': 'greatSpear',
  'Halberd': 'halberd',
  'Halberds': 'halberd',
  'Reaper': 'reaper',
  'Reapers': 'reaper',
  'Whip': 'whip',
  'Whips': 'whip',
  'Fist': 'fist',
  'Fists': 'fist',
  'Claw': 'claw',
  'Claws': 'claw',
  'Light Bow': 'lightBow',
  'Light Bows': 'lightBow',
  'Bow': 'bow',
  'Bows': 'bow',
  'Greatbow': 'greatbow',
  'Greatbows': 'greatbow',
  'Crossbow': 'crossbow',
  'Crossbows': 'crossbow',
  'Ballista': 'ballista',
  'Ballistae': 'ballista',
  'Ballistas': 'ballista',
  'Glintstone Staff': 'glintstoneStaff',
  'Glintstone Staffs': 'glintstoneStaff',
  'Glintstone Staves': 'glintstoneStaff',
  'Sacred Seal': 'sacredSeal',
  'Sacred Seals': 'sacredSeal',
  'Key Items': 'torch', // the regular torch is categorized as a key item on the wiki for some reason
  'Torch': 'torch',
  'Torches': 'torch',
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

const statsFromScraped = (scrapedStats: Array<ScrapedWeaponStats>): Array<WeaponInfusionStats> => {
  return scrapedStats.map((scrapedStats) => {
    const { attack, guard, castingScaling, scaling } = scrapedStats;
    const stats: WeaponInfusionStats = {
      guardBoost: Number(scrapedStats.guardBoost),
      castingScaling: castingScaling
        ? [Number(castingScaling[0]), Number(castingScaling[1])]
        : null,
      scaling: {
        strength: scalingFromScraped(scaling.strength),
        dexterity: scalingFromScraped(scaling.dexterity),
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
  try {
    const maxUpgradeLevel = Object.keys(scraped.infusions.standard).length - 1;
    const infusionKeys = Object.keys(scraped.infusions);
    return {
      name: scraped.name,
      category: categoryKeyMap[scraped.category],
      wikiUrl: scraped.wikiUrl,
      physicalDamageTypes: scraped.physicalDamageTypes.map(type => physicalDamageTypeKeyMap[type]),
      upgradeType: maxUpgradeLevel > 10 ? 'standard' : 'somber',
      infusable: infusionKeys.length > 1,
      weaponArt: 'bladeOfGold', // todo
      weight: stringToNumber(scraped.weight),
      critical: stringToNumber(scraped.critical),
      requiredAttributes: Object.entries(scraped.requiredAttributes).reduce((acc, [key, value]) => {
        return { ...acc, [attributeKeyMap[key]]: Number(value) };
      }, {} as Record<AttributeKey, number>),
      infusions: {
        standard: statsFromScraped(scraped.infusions.standard),
        ...(scraped.infusions.heavy ? { heavy: statsFromScraped(scraped.infusions.heavy) } : {}),
        ...(scraped.infusions.keen ? { keen: statsFromScraped(scraped.infusions.keen) } : {}),
        ...(scraped.infusions.quality ? { quality: statsFromScraped(scraped.infusions.quality) } : {}),
        ...(scraped.infusions.fire ? { fire: statsFromScraped(scraped.infusions.fire) } : {}),
        ...(scraped.infusions.flame ? { flame: statsFromScraped(scraped.infusions.flame) } : {}),
        ...(scraped.infusions.lightning ? { lightning: statsFromScraped(scraped.infusions.lightning) } : {}),
        ...(scraped.infusions.sacred ? { sacred: statsFromScraped(scraped.infusions.sacred) } : {}),
        ...(scraped.infusions.magic ? { magic: statsFromScraped(scraped.infusions.magic) } : {}),
        ...(scraped.infusions.cold ? { cold: statsFromScraped(scraped.infusions.cold) } : {}),
        ...(scraped.infusions.poison ? { poison: statsFromScraped(scraped.infusions.poison) } : {}),
        ...(scraped.infusions.blood ? { poison: statsFromScraped(scraped.infusions.blood) } : {}),
        ...(scraped.infusions.occult ? { occult: statsFromScraped(scraped.infusions.occult) } : {}),
      }
    };
  } catch (e) {
    console.error(`Error mapping ${scraped.name}`);
    throw e;
  }
};

const run = () => {
  const scraped = loadJson();
  const weapons = scraped.map(weaponFromScraped);
  write.sync(`${OUTPUT_DIR}/weapons.json`, JSON.stringify(weapons, null, 2));
};

run();
