type ScrapedWeaponStats = {
  guardBoost: string;
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
  category: string;
  physicalDamageTypes: Array<string>;
  requiredAttributes: Record<string, string>;
  weaponArt: string;
  weight: string;
  critical: string;
  stats: {
    standard: Record<number, ScrapedWeaponStats>;
    heavy: Record<number, ScrapedWeaponStats>;
    keen: Record<number, ScrapedWeaponStats>;
    quality: Record<number, ScrapedWeaponStats>;
    fire: Record<number, ScrapedWeaponStats>;
    flame: Record<number, ScrapedWeaponStats>;
    lightning: Record<number, ScrapedWeaponStats>;
    sacred: Record<number, ScrapedWeaponStats>;
    magic: Record<number, ScrapedWeaponStats>;
    cold: Record<number, ScrapedWeaponStats>;
    poison: Record<number, ScrapedWeaponStats>;
    blood: Record<number, ScrapedWeaponStats>;
    occult: Record<number, ScrapedWeaponStats>;
  }
};
