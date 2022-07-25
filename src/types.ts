export type WeaponTypeKey =
  | 'dagger'
  | 'straightSword'
  | 'greatsword'
  | 'colossalSword'
  | 'thrustingSword'
  | 'heavyThrustingSword'
  | 'curvedSword'
  | 'curvedGreatsword'
  | 'katana'
  | 'twinblade'
  | 'axe'
  | 'greataxe'
  | 'hammer'
  | 'flail'
  | 'greatHammer'
  | 'colossalWeapon'
  | 'spear'
  | 'greatSpear'
  | 'halberd'
  | 'reaper'
  | 'whip'
  | 'fist'
  | 'claw'
  | 'lightBow'
  | 'bow'
  | 'greatbow'
  | 'crossbow'
  | 'ballista'
  | 'glintstoneStaff'
  | 'sacredSeal'
  | 'torch'
  | 'smallShield'
  | 'mediumShield'
  | 'greatshield'
;

export type InfusionKey =
  | 'standard'
  | 'heavy'
  | 'keen'
  | 'quality'
  | 'fire'
  | 'flame'
  | 'lightning'
  | 'sacred'
  | 'magic'
  | 'cold'
  | 'poison'
  | 'blood'
  | 'occult'
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
  | 'rot'
  | 'sleep'
  | 'madness'
  // | 'death'
;

export type UpgradeTypeKey = 'standard' | 'somber';

export type UpgradeLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25;

export type UpgradeLevelStandard = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25;

export type UpgradeLevelSomber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type WeaponScaling = 'S' | 'A' | 'B' | 'C' | 'D' | 'E';

export type AttackType = {
  key: AttackTypeKey;
  name: string;
  shortName: string;
};

export type Attribute = {
  key: AttributeKey;
  name: string;
  shortName: string;
}

export type Effect = {
  key: EffectKey;
  name: string;
  shortName: string;
  icon: string;
};

export type WeaponCategory = {
  key: WeaponTypeKey;
  name: string;
}

export type WeaponArt = {
  key: WeaponArtKey;
  name: string;
}

export type Infusion = {
  key: InfusionKey;
  name: string;
  shortName: string;
}

export type WeaponInfusionStats = {
  guardBoost: number;
  castingScaling: [number, number];
  scaling: Record<AttributeKey, number>;
  attack: Record<AttackTypeKey, number>;
  guard: Record<AttackTypeKey, number>;
  effects: Record<EffectKey, number>;
}

export type WeaponBaseStats = {
  name: string;
  weaponType: WeaponTypeKey;
  wikiUrl: string;
  upgradeType: UpgradeTypeKey;
  physicalDamageTypes: Array<PhysicalDamageTypeKey>;
  weaponArt: WeaponArtKey;
  weight: number;
  infusable: boolean;
  critical: number;
  requiredAttributes: Record<AttributeKey, number>;
}

export type Weapon = WeaponBaseStats & {
  // specialDamage: Record<SpecialDamageTypeKey, number>;
  infusions: Partial<Record<InfusionKey, Array<WeaponInfusionStats>>>;
};

export type InfusedWeapon = WeaponBaseStats & WeaponInfusionStats & {
  infusion: InfusionKey;
  level: UpgradeLevel;
};
