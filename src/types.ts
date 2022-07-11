export type WeaponCategoryKey =
  | 'dagger'
  | 'straightSword'
  | 'greatsword'
  | 'colossalSword'
  | 'thrustingSword'
  | 'heavyThrustingSword'
  | 'curvedSword'
  | 'curvedGreatsword'
  | 'katana'
  // | 'twinblade'
  // | 'axe'
  // | 'greataxe'
  // | 'hammer'
  // | 'flail'
  // | 'greatHammer'
  // | 'colossalWeapon'
  // | 'spear'
  // | 'greatSpear'
  // | 'halberd'
  // | 'reaper'
  // | 'whip'
  // | 'fist'
  // | 'claw'
  // | 'lightBow'
  // | 'bow'
  // | 'greatbow'
  // | 'crossbow'
  // | 'ballista'
  // | 'glintstoneStaff'
  // | 'sacredSeal'
  // | 'torch'
;

export type InfusionKey =
  | 'standard'
  | 'heavy'
  | 'blood'
;

export type WeaponArtKey =
  | 'bladeOfGold'
;

export type AttributeKey =
  | 'strength'
  | 'dexterity'
  | 'intelligence'
  | 'faith'
  | 'arcane'
;

export type AttackTypeKey =
  | 'physical'
  | 'magic'
  | 'fire'
  | 'lightning'
  | 'holy'
;

export type PhysicalDamageTypeKey =
  | 'standard'
  | 'strike'
  | 'slash'
  | 'pierce'

export type SpecialDamageTypeKey =
  | 'gravity'
  | 'undead'
  | 'dragon'
  | 'accursed'
;

export type EffectKey =
  | 'bleed'
  | 'frost'
  | 'poison'
  | 'deadlyPoison'
  | 'rot'
  | 'sleep'
  | 'madness'
  | 'death'

export type UpgradeLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25;

export type UpgradeLevelStandard = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25;

export type UpgradeLevelSomber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type WeaponScaling = 'S' | 'A' | 'B' | 'C' | 'D' | 'E';

export type Attribute = {
  key: AttributeKey;
  name: string;
  shortName: string;
}

export type WeaponCategory = {
  key: WeaponCategoryKey;
  name: string;
}

export type WeaponArt = {
  key: WeaponArtKey;
  name: string;
}

export type Infusion = {
  key: InfusionKey;
  name: string;
}

export type WeaponStats = {
  guardBoost: number;
  scaling: Record<AttributeKey, number>;
  attack: Record<AttackTypeKey, number>;
  guard: Record<AttackTypeKey, number>;
  effects: Record<EffectKey, number>;
}

export type Weapon = {
  name: string;
  category: WeaponCategoryKey;
  upgradeType: 'standard' | 'somber';
  physicalDamageTypes: Array<PhysicalDamageTypeKey>;
  weaponArt: WeaponArtKey;
  weight: number;
  infusable: boolean;
  critical: number;
  requiredAttributes: Record<AttributeKey, number>;
  // specialDamage: Record<SpecialDamageTypeKey, number>;
  stats: Partial<Record<InfusionKey, Partial<Record<UpgradeLevel, WeaponStats>>>>;
};

const scalingMap = {
  100: 'E',
  200: 'D',
  300: 'C',
  400: 'B',
  500: 'A',
  600: 'S',
}
