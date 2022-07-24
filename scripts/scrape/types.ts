export type ScrapedWeaponStats = {
  guardBoost: string;
  castingScaling: [string, string];
  scaling: {
    strength: string;
    dexterity: string;
    intelligence: string;
    faith: string;
    arcane: string;
  };
  attack: {
    physical: string;
    magic: string;
    fire: string;
    lightning: string;
    holy: string;
  };
  guard: {
    physical: string;
    magic: string;
    fire: string;
    lightning: string;
    holy: string;
  };
  effects: {};
};

export type ScrapedWeapon = {
  name: string;
  weaponType: string;
  wikiUrl: string;
  physicalDamageTypes: Array<string>;
  requiredAttributes: Record<string, string>;
  weaponArt: string;
  weight: string;
  critical: string;
  infusions: {
    standard: Array<ScrapedWeaponStats>;
    heavy: Array<ScrapedWeaponStats>;
    keen: Array<ScrapedWeaponStats>;
    quality: Array<ScrapedWeaponStats>;
    fire: Array<ScrapedWeaponStats>;
    flame: Array<ScrapedWeaponStats>;
    lightning: Array<ScrapedWeaponStats>;
    sacred: Array<ScrapedWeaponStats>;
    magic: Array<ScrapedWeaponStats>;
    cold: Array<ScrapedWeaponStats>;
    poison: Array<ScrapedWeaponStats>;
    blood: Array<ScrapedWeaponStats>;
    occult: Array<ScrapedWeaponStats>;
  }
};
