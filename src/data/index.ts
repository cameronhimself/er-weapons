import {
  AttackType,
  AttackTypeKey,
  Attribute,
  AttributeKey,
  Effect,
  EffectKey,
  Infusion,
  InfusionKey,
  InfusedWeapon,
  UpgradeLevel,
  Weapon,
  WeaponArt,
  WeaponArtKey,
  WeaponCategory,
  WeaponTypeKey,
} from '../types';
import { effectIcons } from '../images';
import weaponsRaw from './weapons.json';

export const weapons = weaponsRaw as Array<Weapon>;

export const infusedWeapons: Array<InfusedWeapon> = weapons.reduce((acc, weapon) => {
  const { infusions, ...baseStats } = weapon;

  Object.entries(infusions).forEach(([k, infusion]) => {
    const infusionKey = k as InfusionKey;
    // const infusionMinLevel = 0;
    // const infusionMinStats = infusion[infusionMinLevel];
    const infusionMaxLevel = infusion.length - 1;
    const infusionMaxStats = infusion[infusionMaxLevel];

    // acc.push({
    //   ...baseStats,
    //   ...infusionMinStats,
    //   infusion: infusionKey,
    //   level: infusionMinLevel as UpgradeLevel,
    // });

    acc.push({
      ...baseStats,
      ...infusionMaxStats,
      infusion: infusionKey,
      level: infusionMaxLevel as UpgradeLevel,
    });
  });

  return acc;
}, [] as Array<InfusedWeapon>);

const makeDataList = <TValues, TKey extends string>(lookup: Record<TKey, TValues>) => {
  return Object.entries(lookup).map(([key, data]) => ({
    key: key as TKey,
    ...data as TValues,
  }));
}

export const attackTypeLookup: Record<AttackTypeKey, Omit<AttackType, 'key'>> = {
  physical: { name: 'Physical', shortName: 'Phy' },
  magic: { name: 'Magic', shortName: 'Mag' },
  fire: { name: 'Fire', shortName: 'Fire' },
  lightning: { name: 'Lightning', shortName: 'Lit' },
  holy: { name: 'Holy', shortName: 'Holy' },
};

export const weaponTypeLookup: Record<WeaponTypeKey, Omit<WeaponCategory, 'key'>> = {
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
  smallShield: { name: 'Small Shield' },
  mediumShield: { name: 'Medium Shield' },
  greatshield: { name: 'Greatshield' },
};

export const weaponArtLookup: Record<WeaponArtKey, Omit<WeaponArt, 'key'>> = {
  bladeOfGold: { name: 'Blade of Gold' },
};

export const infusionLookup: Record<InfusionKey, Omit<Infusion, 'key'>> = {
  standard: { name: 'Standard', shortName: 'Std' },
  heavy: { name: 'Heavy', shortName: 'Hvy' },
  keen: { name: 'Keen', shortName: 'Keen' },
  quality: { name: 'Quality', shortName: 'Qua' },
  fire: { name: 'Fire', shortName: 'Fire' },
  flame: { name: 'Flame', shortName: 'Flame' },
  lightning: { name: 'Lightning', shortName: 'Lit' },
  sacred: { name: 'Sacred', shortName: 'Sac' },
  magic: { name: 'Magic', shortName: 'Mag' },
  cold: { name: 'Cold', shortName: 'Cold' },
  poison: { name: 'Poison', shortName: 'Poi' },
  blood: { name: 'Blood', shortName: 'Blood' },
  occult: { name: 'Occult', shortName: 'Occ' },
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

export const effectLookup: Record<EffectKey, Omit<Effect, 'key'>> = {
  bleed: {
    name: 'Hemmorhage',
    shortName: 'Bleed',
    icon: effectIcons.bleed,
  },
  poison: {
    name: 'Poison',
    shortName: 'Poison',
    icon: effectIcons.poison,
  },
  frost: {
    name: 'Frostbite',
    shortName: 'Frost',
    icon: effectIcons.frost,
  },
  rot: {
    name: 'Scarlet Rot',
    shortName: 'Rot',
    icon: effectIcons.rot,
  },
  sleep: {
    name: 'Sleep',
    shortName: 'Sleep',
    icon: effectIcons.sleep,
  },
  madness: {
    name: 'Madness',
    shortName: 'Madness',
    icon: effectIcons.madness,
  },
  // death: {
  //   name: 'Death Blight',
  //   shortName: 'Death',
  //   icon: effectIcons.death,
  // },
};

export const attackTypes: Array<AttackType> = makeDataList(attackTypeLookup);
export const attributes: Array<Attribute> = makeDataList(attributeLookup);
export const effects: Array<Effect> = makeDataList(effectLookup);
export const infusions: Array<Infusion> = makeDataList(infusionLookup);
export const weaponTypes: Array<WeaponCategory> = makeDataList(weaponTypeLookup);
export const weaponArts: Array<WeaponArt> = makeDataList(weaponArtLookup);
