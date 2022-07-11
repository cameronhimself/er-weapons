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
} from './types';

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
};

export const weaponArtLookup: Record<WeaponArtKey, Omit<WeaponArt, 'key'>> = {
  bladeOfGold: { name: 'Blade of Gold' },
};

export const infusionLookup: Record<InfusionKey, Omit<Infusion, 'key'>> = {
  standard: { name: 'Standard' },
  heavy: { name: 'Heavy' },
  blood: { name: 'Blood' },
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
export const weapons: Array<Weapon> = [
  {
    name: 'Blade of Calling',
    category: 'dagger',
    upgradeType: 'somber',
    physicalDamageTypes: ['slash', 'pierce'],
    weaponArt: 'bladeOfGold',
    weight: 1.5,
    infusable: false,
    critical: 110,
    requiredAttributes: {
      strength: 6,
      dexterity: 13,
      intelligence: 0,
      faith: 15,
      arcane: 0,
    },
    specialDamage: {
      gravity: 0,
      undead: 0,
      dragon: 0,
      accursed: 0,
    },
    stats: {
      standard: {
        0: {
          guardBoost: 15,
          scaling: {
            strength: 200,
            dexterity: 200,
            intelligence: 0,
            faith: 200,
            arcane: 0,
          },
          attack: {
            physical: 71,
            magic: 0,
            fire: 0,
            lightning: 0,
            holy: 43,
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
          guard: {
            physical: 31,
            magic: 18,
            fire: 18,
            lightning: 18,
            holy: 30,
          },
        },
        10: {
          guardBoost: 16,
          scaling: {
            strength: 200,
            dexterity: 300,
            intelligence: 0,
            faith: 400,
            arcane: 0,
          },
          attack: {
            physical: 173,
            magic: 0,
            fire: 0,
            lightning: 0,
            holy: 105,
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
          guard: {
            physical: 31,
            magic: 18,
            fire: 18,
            lightning: 18,
            holy: 30,
          }
        }
      }
    }
  },
];
