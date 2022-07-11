import {
  Attribute,
  AttributeKey,
  Infusion,
  InfusionKey,
  Weapon,
  WeaponArt,
  WeaponArtKey,
  WeaponCategory,
  WeaponCategoryKey,
} from '../types';
// import weaponsRaw from './weapons.json';

export const weapons = [] as Array<Weapon>;
// export const weapons = weaponsRaw as Array<Weapon>;

const makeDataList = <TValues, TKey extends string>(lookup: Record<TKey, TValues>) => {
  return Object.entries(lookup).map(([key, data]) => ({
    key: key as TKey,
    ...data as TValues,
  }));
}

export const weaponCategoryLookup: Record<WeaponCategoryKey, Omit<WeaponCategory, 'key'>> = {
  dagger: { name: 'Dagger' },
  straightSword: { name: 'Straight Sword' },
  greatsword: { name: 'Greatsword' },
  colossalSword: { name: 'Colossal Sword' },
  thrustingSword: { name: 'Thrusting Sword' },
  heavyThrustingSword: { name: 'Heavy Thrusting Sword' },
  curvedSword: { name: 'Curved Sword' },
  curvedGreatsword: { name: 'Curved Greatsword' },
  katana: { name: 'Katana' },
  twinblade: { name: 'Twinblade' },
  axe: { name: 'Axe' },
  greataxe: { name: 'Greataxe' },
  hammer: { name: 'Hammer' },
  flail: { name: 'Flail' },
  greatHammer: { name: 'Great Hammer' },
  colossalWeapon: { name: 'Colossal Weapon' },
  spear: { name: 'Spear' },
  greatSpear: { name: 'Great Spear' },
  halberd: { name: 'Halberd' },
  reaper: { name: 'Reaper' },
  whip: { name: 'Whip' },
  fist: { name: 'Fist' },
  claw: { name: 'Claw' },
  lightBow: { name: 'Light Bow' },
  bow: { name: 'Bow' },
  greatbow: { name: 'Greatbow' },
  crossbow: { name: 'Crossbow' },
  ballista: { name: 'Ballista' },
  glintstoneStaff: { name: 'Glintstone Staff' },
  sacredSeal: { name: 'Sacred Seal' },
  torch: { name: 'Torch' },
};

export const weaponArtLookup: Record<WeaponArtKey, Omit<WeaponArt, 'key'>> = {
  bladeOfGold: { name: 'Blade of Gold' },
};

export const infusionLookup: Record<InfusionKey, Omit<Infusion, 'key'>> = {
  standard: { name: 'Standard' },
  heavy: { name: 'Heavy' },
  keen: { name: 'Keen' },
  quality: { name: 'Quality' },
  fire: { name: 'Fire' },
  flame: { name: 'Flame' },
  lightning: { name: 'Lightning' },
  sacred: { name: 'Sacred' },
  magic: { name: 'Magic' },
  cold: { name: 'Cold' },
  poison: { name: 'Poison' },
  blood: { name: 'Blood' },
  occult: { name: 'Occult' },
};

export const attributeLookup: Record<AttributeKey, Omit<Attribute, 'key'>> = {
  strength: {
    name: 'Strength',
    shortName: 'Str',
  },
  dexterity: {
    name: 'Dexterity',
    shortName: 'Dex',
  },
  intelligence: {
    name: 'Intelligence',
    shortName: 'Int',
  },
  faith: {
    name: 'Faith',
    shortName: 'Fai',
  },
  arcane: {
    name: 'arcane',
    shortName: 'Arc',
  },
};

export const attributes: Array<Attribute> = makeDataList(attributeLookup);
export const infusions: Array<Infusion> = makeDataList(infusionLookup);
export const weaponCategories: Array<WeaponCategory> = makeDataList(weaponCategoryLookup);
export const weaponArts: Array<WeaponArt> = makeDataList(weaponArtLookup);
