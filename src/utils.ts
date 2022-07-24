import { SCALING_MAP, WIKI_BASE_URL } from './constants';
import {
  attackTypeLookup,
  infusionLookup,
  weaponTypeLookup,
} from './data';
import {
  AttackTypeKey,
  InfusionKey,
  PhysicalDamageTypeKey,
  WeaponTypeKey,
  WeaponScaling,
} from './types';
import { invert } from 'lodash';

export { invert};

export const getName = <TKey extends string = string>(
  key: TKey,
  lookup: Record<TKey, { name: string }>
): string => {
  return key ? lookup[key].name : '';
}

export const getShortName = <TKey extends string = string>(
  key: TKey,
  lookup: Record<TKey, { shortName: string }>
): string => {
  return key ? lookup[key].shortName : '';
}

export const getAttackTypeName = (attackTypeKey: AttackTypeKey): string => {
  return getName(attackTypeKey, attackTypeLookup);
};

export const getAttackTypeShortName = (attackTypeKey: AttackTypeKey): string => {
  return getShortName(attackTypeKey, attackTypeLookup);
};

export const getWeaponTypeName = (weaponTypeKey: WeaponTypeKey): string => {
  return getName(weaponTypeKey, weaponTypeLookup);
};

export const getInfusionName = (infusionKey: InfusionKey): string => {
  return getName(infusionKey, infusionLookup);
};

export const getInfusionShortName = (infusionKey: InfusionKey): string => {
  return getShortName(infusionKey, infusionLookup);
};

export const getScalingLetter = (scaling: keyof typeof SCALING_MAP): WeaponScaling => {
  return SCALING_MAP[scaling];
};

export const getPhysicalDamageTypeName = (damageTypeKey: PhysicalDamageTypeKey): string => {
  return {
    standard: 'Standard',
    strike: 'Strike',
    slash: 'Slash',
    pierce: 'Pierce',
  }[damageTypeKey];
}

export const getWikiUrl = (path?: string): string => {
  return `${WIKI_BASE_URL}/${path || ''}`
};
