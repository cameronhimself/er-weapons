import {
  OUTPUT_DIR,
  SCRAPED_FILEPATH,
} from './constants';
import { ScrapedWeapon } from './types';
import { Weapon, WeaponCategoryKey } from '../../src/types';

const categoryKeyMap: Record<string, WeaponCategoryKey> = {
  'Dagger': 'dagger',
  'Straight Sword': 'straightSword',
  'Great Sword': 'greatSword',
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
  'Crossbow': 'crossbos',
  'Ballista': 'ballista',
  'Glintstone Staff': 'glintstoneStaff',
  'Sacred Seal': 'sacredSeal',
  'Torch': 'torch',
};

const physicalDamageTypeKeyMap: Record<string, PhysicalDamageTypeKey> = {
  'Standard': 'standard',
  'Strike': 'strike',
  'Slash': 'slash',
  'Pierce': 'pierce',
};

const attributeKeyMap: Record<string, AttributeKey> = {
  Str: 'strength',
  Dex: 'dexterity',
  Int: 'intelligence',
  Fai: 'faith',
  Arc: 'arcane',
};

const loadJson = (): Array<ScrapedWeapon> => {
  if (!fs.existsSync(SCRAPED_FILEPATH)) {
    throw new Error('Scraped data file does not exist; run scrape first.');
  }
  return JSON.parse(fs.readFileSync(SCRAPED_FILEPATH, 'utf8'));
};

const weaponFromScraped = (scraped: ScrapedWeapon): Weapon => {
  const maxUpgradeLevel = scraped.stats.standard.length - 1;
  const infusions = Object.keys(scraped.stats);
  return {
    name: scraped.name,
    category: categoryKeyMap[scraped.category],
    physicalDamageTypes: scraped.physicalDamageTypes.map(type => physicalDamageTypeKeyMap[type]),
    upgradeType: maxUpgradeLevel > 10 ? 'standard' : 'somber',
    infusable: infusions > 1,
    weaponArt: '', // todo
    weight: Number(scraped.weight),
    critical: Number(scraped.critical),
    requiredAttributes: Object.entries(scraped.requiredAttributes).reduce((acc, [key, value]) => (
      { ...acc, [key]: Number(value) };
    ), {}),
  };
};

const run = () => {
  const scraped = loadJson();
  const weapons = scraped.map(weaponFromScraped);
  write.sync(`${OUTPUT_DIR}/cocktails.json`, JSON.stringify(cocktails, null, 2));
};

run();
