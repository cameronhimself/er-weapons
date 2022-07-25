import React from 'react';
import styled from 'styled-components';
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  GroupingState,
  SortDirection,
  SortingState,
  Table,
  Row as RowType,
  Cell as CellType,
} from '@tanstack/react-table';
import { icons as i } from '../../components';
import {
  infusions,
  infusedWeapons,
  weaponTypeLookup,
  weaponTypes,
} from '../../data';
import { InfusionKey, InfusedWeapon, WeaponTypeKey } from '../../types';
import { infusionIcons } from '../../images';
import { columns as defaultColumns } from './columns';

export type WeaponTypeFilters = Record<WeaponTypeKey, boolean>;
export type InfusionFilters = Record<InfusionKey, boolean>;

const TableHeader = styled.thead`
  position: sticky;
  top: 0;
  z-index: 1;
  :before {
    content: '';
    position: absolute;
    display: block;
    width: 10px;
    height: 100%;
    margin; auto;
    background: linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 20%);
    top: 0;
    bottom: 0;
    transform: translateX(-100%);
  }
  :after {
    content: '';
    height: 8px;
    display: block;
  }
`;

const StyledWeaponTable = styled.table`
  border-spacing: 0;
  width: 100%;
  border-collapse: collapse;
`;

const BasicRow = styled.tr<{ index: number }>`
  border-bottom: 1px solid #ccc;
  background: ${({ index }) => index % 2 ? '#fff' : '#f9f9f9'};
`;

const GroupHeaderRow = styled.tr`
  font-size: 16px;
  color: #fff;
  > td {
    padding: 6px;
    background: none;
    :last-child {
      padding: 0;
    }
  }
`;

const TypeHeaderRow = styled(GroupHeaderRow)<{ weaponType: WeaponTypeKey }>`
  font-weight: bold;
  :first-child {
    td {
      border-top: none;
    }
  }
  > td {
    border-top: 20px solid #fff;
    border-bottom: 5px solid #fff;
    padding: 8px 0;
    background: #D16666;
    color: #fff;
  }
`;

const InfusionHeaderRow = styled(GroupHeaderRow)<{ infusion: InfusionKey }>`
  background: white;
  font-size: 14px;
  color: #000;
  border-bottom: 2px solid #000;
  font-weight: normal;
  > td {
    padding-top: 10px;
    :first-child {
      ::before {
        content: '';
        background-image: url(${({ infusion }) => infusionIcons[infusion]});
        width: 16px;
        height: 16px;
        background-size: contain;
        margin-right: 5px;
        display: inline-block;
        vertical-align: middle;
        margin-bottom: 3px;
      }
    }
  }
`;

type RowProps = {
  index: number;
  children: React.ReactNode;
  row: RowType<InfusedWeapon>;
};

const Row: React.FC<RowProps> = (props) => {
  const { row, ...rowProps } = props;
  const RowComponent = row.getIsGrouped()
    ? GroupHeaderRow
    : BasicRow;
  if (row.groupingColumnId === 'infusion') {
    return <InfusionHeaderRow {...rowProps} infusion={row.original.infusion} />;
  }
  if (row.groupingColumnId === 'type') {
    return <TypeHeaderRow {...rowProps} weaponType={row.original.weaponType} />;
  }
  return <RowComponent {...rowProps} />;
};

const HeadRow = styled.tr`
  background: #eee;
`;

const BasicCell = styled.td`
  padding: 3px 6px;
  white-space: nowrap;
  background: transparent;
  border-left: none;
  border-right: none;
`;

const cellComponentMap: Record<string, any> = {
  requiredAttributes: styled(BasicCell)`
    box-shadow: inset 0 0 0px 9999px rgba(128,200,128,0.05)
  `,
  attackPower: styled(BasicCell)`
    box-shadow: inset 0 0 0px 9999px rgba(200,128,128,0.05)
  `,
  damageReduction: styled(BasicCell)`
    box-shadow: inset 0 0 0px 9999px rgba(128,128,200,0.05)
  `,
  effect: styled(BasicCell)`
    box-shadow: inset 0 0 0px 9999px rgba(200,200,128,0.05)
  `,
};


const Cell: React.FC<React.HTMLProps<HTMLTableCellElement> & { cell: CellType<any, any>, children?: React.ReactNode }> = props => {
  const { cell } = props;
  const CellComponent = cell.getIsAggregated()
    ? BasicCell
    : cellComponentMap[cell.column.id.split('_')[0]] || BasicCell;
  return <CellComponent {...props} />;
}

const HeadCell = styled.th<{ sortable: boolean }>`
  white-space: nowrap;
  padding: 3px 6px;
  background: #2C4251;
  color: #fff;
  border: none;
  border-right: 1px solid #888;
  cursor: ${({ sortable }) => sortable ? 'pointer' : 'default'};
  font-weight: ${({ sortable }) => sortable ? 'bold' : 'normal'};
`;

const SortIcon: React.FC<{ direction: SortDirection | false }> = (props) => {
  const { direction } = props;
  const Icon = direction
    ? { asc: i.SortAscending, desc: i.SortDescending }[direction]
    : undefined;
  return (
    <span style={{ width: '100%', height: '8px', display: 'flex', justifyContent: 'center' }}>
      {Icon && <Icon size="0.95em" style={{ verticalAlign: 'middle', marginTop: '-3px' }} />}
    </span>
  );
};

export const useWeaponTable = () => {
  const [data] = React.useState(infusedWeapons.sort((a, b) => {
    const weaponTypeKeys = Object.keys(weaponTypeLookup) as Array<WeaponTypeKey>;
    const indexA = weaponTypeKeys.indexOf(a.weaponType);
    const indexB = weaponTypeKeys.indexOf(b.weaponType);
    return (indexA < indexB) ? -1 : (indexA > indexB) ? 1 : 0;
  }));
  const [columns] = React.useState<typeof defaultColumns>(defaultColumns);
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({
    guardBoost: false,
    guard: false,
    upgradeType: false,
    physicalDamageTypes: false,
  });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [grouping, setGrouping] = React.useState<GroupingState>(['type', 'infusion']);
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([
    {
      id: 'type',
      value: weaponTypes.reduce(
        (acc, { key }) => ({ ...acc, [key]: key === 'dagger' }),
        {} as WeaponTypeFilters
      )
    },
    {
      id: 'infusion',
      value: infusions.reduce(
        (acc, { key }) => ({ ...acc, [key]: ['standard', 'keen'].includes(key) }),
        {} as InfusionFilters
      )
    },
  ]);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      columnFilters,
      globalFilter,
      grouping,
      sorting,
      expanded: true,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGroupingChange: setGrouping,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableGrouping: true,
  });
  return table;
};

export const WeaponTable: React.FC<{ table: Table<InfusedWeapon> }> = (props) => {
  const { table } = props;

  return (
    <StyledWeaponTable>
      <TableHeader>
        {table.getHeaderGroups().map(headerGroup => (
          <HeadRow key={headerGroup.id}>
            {headerGroup.headers.map(header => !header.column.getIsGrouped() && (
              <HeadCell key={header.id} colSpan={header.colSpan} sortable={!header.isPlaceholder && header.column.getCanSort()}>
                {!header.isPlaceholder && (
                  <div onClick={header.column.getToggleSortingHandler()}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    <SortIcon direction={header.column.getIsSorted()} />
                  </div>
                )}
              </HeadCell>
            ))}
          </HeadRow>
        ))}
      </TableHeader>
      <tbody>
        {table.getRowModel().rows.map((row, i) => (
          <Row key={row.id} index={i} row={row}>
            {row.getVisibleCells().map(cell => !cell.getIsPlaceholder() && (
              <Cell key={cell.id} className={cell.column.id} cell={cell}>
                {!cell.getIsAggregated() && !cell.getIsPlaceholder() && flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext()
                )}
              </Cell>
            ))}
          </Row>
        ))}
      </tbody>
    </StyledWeaponTable>
  );
};
