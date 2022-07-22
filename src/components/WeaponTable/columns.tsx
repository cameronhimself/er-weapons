import { ColumnDef } from '@tanstack/react-table';
import { attackTypes, attributes } from '../../data';
import { InfusedWeapon } from '../../types';
import {
  getAttackTypeShortName,
  getCategoryName,
  getInfusionName,
  getPhysicalDamageTypeName,
  getScalingLetter,
} from '../../utils';
import { NumberColumn, WeaponLink } from './components';

export const columns: ColumnDef<InfusedWeapon>[] = [
  {
    header: 'Name',
    id: 'name',
    accessorKey: 'name',
    cell: info => (
      <WeaponLink href={info.row.original.wikiUrl} name={info.row.original.name} />
    ),
    footer: info => info.column.id,
  },
  {
    header: 'Type',
    id: 'type',
    enableSorting: false,
    filterFn: (row, _, filterValue) => {
      const value = row.original.category;
      return filterValue[value];
    },
    accessorFn: row => getCategoryName(row.category),
    cell: info => info.getValue(),
  },
  // {
  //   header: 'Upgrade',
  //   accessorFn: row => row.upgradeType === 'somber' ? 'Somber (+10)' : 'Standard (+25)',
  //   cell: info => info.getValue(),
  // },
  {
    header: 'Phy. Dmg',
    accessorFn: row => row.physicalDamageTypes.map(getPhysicalDamageTypeName).join('/'),
    cell: info => info.getValue(),
  },
  {
    header: 'Required Attributes',
    id: 'requiredAttributes',
    columns: attributes.map(attr => ({
      header: attr.shortName,
      accessorFn: row => row.requiredAttributes[attr.key] || 0,
      aggregationFn: () => 0,
      cell: info => <NumberColumn>{info.getValue() || ''}</NumberColumn>,
    })),
  },
  {
    header: 'Infusion',
    id: 'infusion',
    enableSorting: false,
    accessorFn: row => getInfusionName(row.infusion),
    filterFn: (row, _, filterValue) => {
      const value = row.original.infusion;
      return filterValue[value];
    },
    cell: info => info.getValue(),
  },
  {
    header: 'Attack Power',
    id: 'attackPower',
    columns: attackTypes.map(attackType => ({
      id: `attackPower_${attackType.key}`,
      header: getAttackTypeShortName(attackType.key),
      accessorFn: row => row.attack[attackType.key] || undefined,
      aggregationFn: () => 0,
      cell: info => <NumberColumn>{info.getValue()}</NumberColumn>,
      sortUndefined: 1,
    })),
  },
  {
    header: 'Stat Scaling',
    id: 'statScaling',
    columns: attributes.map(attr => ({
      id: `statScaling_${attr.key}`,
      header: attr.shortName,
      accessorFn: row => row.scaling[attr.key] || undefined,
      aggregationFn: () => 0,
      cell: info => getScalingLetter(info.getValue()) || '',
      sortUndefined: 1,
    })),
  },
  {
    header: 'Damage Reduction (%)',
    id: 'damageReduction',
    columns: attackTypes.map(attackType => ({
      id: `damageReduction_${attackType.key}`,
      header: getAttackTypeShortName(attackType.key),
      accessorFn: row => row.guard[attackType.key] || undefined,
      aggregationFn: () => 0,
      cell: info => <NumberColumn>{info.getValue()}</NumberColumn>,
      sortUndefined: 1,
    })),
  },
];
