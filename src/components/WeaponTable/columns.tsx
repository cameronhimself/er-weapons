import styled from 'styled-components';
import { ColumnDef } from '@tanstack/react-table';
import { attackTypes, attributes } from '../../data';
import { weaponTypeIcons } from '../../images';
import { AttackTypeKey, InfusedWeapon, InfusionKey, WeaponTypeKey } from '../../types';
import {
  getAttackTypeShortName,
  getWeaponTypeName,
  getInfusionName,
  getPhysicalDamageTypeName,
  getScalingLetter,
} from '../../utils';
import { NumberColumn, WeaponLink } from './components';

const WeaponTypeIcon = styled.span<{ weaponType: WeaponTypeKey }>`
  position: absolute;
  content: '';
  box-sizing: border-box;
  background-image: url(${({ weaponType }) => weaponTypeIcons[weaponType]});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 70%;
  width: 45px;
  height: 45px;
  background-color: #fff;
  border-radius: 9999px;
  border: 3px solid #D16666;
  display: inline-block;
  vertical-align: middle;
  left: -10px;
  top: 0;
  bottom: 0;
  margin: auto;
`;

const WeaponTypeLabel = styled.span`
  padding-left: 45px;
`;

const WeaponTypeContainer = styled.span`
  position: relative;
  display: flex;
  height: 100%;
  align-items: center;
`;

const DamageColumn = styled(NumberColumn)<{ attackType: AttackTypeKey, infusion: InfusionKey }>`
  color: ${({ attackType }) => ({
    physical: '#000',
    magic: '#00c',
    fire: '#c00',
    lightning: '#ca0',
    holy: '#885',
  }[attackType])};
`;

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
      const value = row.original.weaponType;
      return filterValue[value];
    },
    accessorFn: row => getWeaponTypeName(row.weaponType),
    cell: info => !info.row.getIsGrouped() ? info.getValue() : (
      <WeaponTypeContainer>
        <WeaponTypeIcon weaponType={info.row.original.weaponType} />
        <WeaponTypeLabel>{info.getValue()}</WeaponTypeLabel>
      </WeaponTypeContainer>
    ),
  },
  // {
  //   header: 'Upgrade',
  //   accessorFn: row => row.upgradeType === 'somber' ? 'Somber (+10)' : 'Standard (+25)',
  //   cell: info => info.getValue(),
  // },
  {
    header: 'Phy. Dmg',
    id: 'physicalDamageTypes',
    accessorFn: row => row.physicalDamageTypes.map(getPhysicalDamageTypeName).join('/'),
    cell: info => info.getValue(),
  },
  {
    header: 'Required Attributes',
    id: 'requiredAttributes',
    columns: attributes.map(attr => ({
      header: attr.shortName,
      accessorFn: row => row.requiredAttributes[attr.key] || 0,
      aggregationFn: () => 1,
      sortingFn: 'basic',
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
    columns: [
      ...attackTypes.map<ColumnDef<InfusedWeapon>>(attackType => ({
        id: `attackPower_${attackType.key}`,
        header: getAttackTypeShortName(attackType.key),
        accessorFn: row => row.attack[attackType.key] || undefined,
        aggregationFn: () => 1,
        cell: info => <DamageColumn infusion={info.row.original.infusion} attackType={attackType.key}>{info.getValue()}</DamageColumn>,
        sortUndefined: 1,
      })),
      {
        id: `attackPower_total`,
        header: 'Total',
        accessorFn: row => Object.values(row.attack).reduce((acc, v) => acc + v),
        aggregationFn: () => 1,
        cell: info => <NumberColumn>{info.getValue()}</NumberColumn>,
      },
    ]
  },
  {
    header: 'Stat Scaling',
    id: 'statScaling',
    columns: attributes.map(attr => ({
      id: `statScaling_${attr.key}`,
      header: attr.shortName,
      accessorFn: row => row.scaling[attr.key] || undefined,
      aggregationFn: () => 1,
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
      aggregationFn: () => 1,
      cell: info => <NumberColumn>{info.getValue()}</NumberColumn>,
      sortUndefined: 1,
    })),
  },
];
