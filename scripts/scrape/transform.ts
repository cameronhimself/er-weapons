import * as fs from 'fs';
import * as write from 'write';
import { OUTPUT_DIR } from './constants';
import { Weapon } from '../../src/types';

const run = async () => {
  const weapons: Array<Weapon> = JSON.parse(fs.readFileSync(`${OUTPUT_DIR}/weapons.json`, 'utf8'));
  const infusedWeapons = weapons.reduce((acc, weapon) => {
    const { infusions, ...baseStats } = weapon;

    Object.entries(infusions).forEach(([k, infusion]) => {
      const infusionKey = k;
      const infusionMaxLevel = infusion.length - 1;
      const infusionMaxStats = infusion[infusionMaxLevel];

      acc.push({
        ...baseStats,
        ...infusionMaxStats,
        infusion: infusionKey,
        level: infusionMaxLevel,
      });
    });

    return acc;
  }, []);

  write.sync(`${OUTPUT_DIR}/infusedWeapons.json`, JSON.stringify(infusedWeapons));
};


run();
