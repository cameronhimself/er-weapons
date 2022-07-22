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
  Table,
} from '@tanstack/react-table';
import { icons as i } from '../../components';
import {
  infusions,
  infusedWeapons,
  weaponCategoryLookup,
  weaponCategories,
} from '../../data';
import { InfusionKey, InfusedWeapon, WeaponCategoryKey } from '../../types';
import { columns as defaultColumns } from './columns';

export type WeaponTypeFilters = Record<WeaponCategoryKey, boolean>;
export type InfusionFilters = Record<InfusionKey, boolean>;

const StyledWeaponTable = styled.table`
  border-spacing: 0;
  width: 100%;
`;

const Row = styled.tr<{ index: number }>`
  background-color: ${({ index }) => index % 2 ? '#eee' : '#fff'};
`;

const HeadRow = styled.tr`
  background: #333;
`;

const Cell = styled.td`
  padding: 3px 6px;
  white-space: nowrap;
`;

const HeadCell = styled.th<{ sortable: boolean }>`
  white-space: nowrap;
  padding: 3px 6px;
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
    <span style={{ width: '7px', display: 'inline-block' }}>
      {Icon && <Icon size="0.95em" style={{ verticalAlign: 'middle' }} />}
    </span>
  );
};

export const useWeaponTable = () => {
  const [data] = React.useState(infusedWeapons.sort((a, b) => {
    const categoryKeys = Object.keys(weaponCategoryLookup) as Array<WeaponCategoryKey>;
    const indexA = categoryKeys.indexOf(a.category);
    const indexB = categoryKeys.indexOf(b.category);
    return (indexA < indexB) ? -1 : (indexA > indexB) ? 1 : 0;
  }));
  const [columns] = React.useState<typeof defaultColumns>(defaultColumns);
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [grouping, setGrouping] = React.useState<GroupingState>(['type']);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([
    {
      id: 'type',
      value: weaponCategories.reduce(
        (acc, { key }) => ({ ...acc, [key]: true }),
        {} as WeaponTypeFilters
      )
    },
    {
      id: 'infusion',
      value: infusions.reduce(
        (acc, { key }) => ({ ...acc, [key]: key === 'standard' }),
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
      expanded: true,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGroupingChange: setGrouping,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableGrouping: true,
  });
  return table;
};

export const WeaponTable: React.FC<{ table: Table<InfusedWeapon> }> = (props) => {
  const { table } = props;

  return (
    <StyledWeaponTable>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <HeadRow key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <HeadCell key={header.id} colSpan={header.colSpan} sortable={!header.isPlaceholder && header.column.getCanSort()}>
                {header.isPlaceholder ? null : (
                  <div {...{
                    className: header.column.getCanSort()
                      ? 'cursor-pointer select-none'
                      : '',
                    onClick: header.column.getToggleSortingHandler(),
                  }}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getCanSort() && <SortIcon direction={header.column.getIsSorted()} />}
                  </div>
                )}
              </HeadCell>
            ))}
          </HeadRow>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row, i) => (
          <Row key={row.id} index={i}>
            {row.getVisibleCells().map(cell => (
              <td
                {...{
                  key: cell.id,
                  style: {
                    background: cell.getIsGrouped()
                      ? '#0aff0082'
                      : cell.getIsAggregated()
                      ? '#ffa50078'
                      : cell.getIsPlaceholder()
                      ? '#ff000042'
                      : 'white',
                  },
                }}
              >
                {cell.getIsGrouped() ? (
                  // If it's a grouped cell, add an expander and row count
                  <>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}{' '}
                  </>
                ) : cell.getIsAggregated() ? (
                  null
                ) : cell.getIsPlaceholder() ? null : ( // For cells with repeated values, render null
                  // Otherwise, just render the regular cell
                  flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )
                )}
              </td>
            ))}
          </Row>
        ))}
      </tbody>
    </StyledWeaponTable>
  );
};
