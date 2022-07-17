import React from 'react';
import styled from 'styled-components';
import {
  Table,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { A, Mono } from './components';
import {
  attackTypes,
  attributes,
  infusions,
  infusedWeapons,
  weaponCategories,
} from './data';
import { fonts } from './style';
import {
  InfusedWeapon,
  InfusionKey,
  WeaponCategoryKey,
} from './types';
import {
  getAttackTypeShortName,
  getCategoryName,
  getInfusionShortName,
  getPhysicalDamageTypeName,
  getScalingLetter,
} from './utils';

const defaultData = infusedWeapons;

const NumberColumn = styled(Mono)`
  display: block;
  text-align: right;
`;

const defaultColumns: ColumnDef<InfusedWeapon>[] = [
  {
    header: 'Name',
    accessorKey: 'name',
    accessorFn: row => <A target="_blank" href={row.wikiUrl}>{row.name}</A>,
    cell: info => info.getValue(),
    footer: info => info.column.id,
  },
  {
    header: 'Type',
    id: 'type',
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
      accessorFn: row => <NumberColumn>{row.requiredAttributes[attr.key] || undefined}</NumberColumn>,
      cell: info => info.getValue(),
      sortUndefined: 1,
    })),
  },
  {
    header: 'Infusion',
    id: 'infusion',
    accessorFn: row => getInfusionShortName(row.infusion),
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
      accessorFn: row => <NumberColumn>{row.attack[attackType.key] || ''}</NumberColumn>,
      cell: info => info.getValue(),
    })),
  },
  {
    header: 'Stat Scaling',
    id: 'statScaling',
    columns: attributes.map(attr => ({
      id: `statScaling_${attr.key}`,
      header: attr.shortName,
      accessorFn: row => getScalingLetter(row.scaling[attr.key]) || '',
      cell: info => info.getValue(),
    })),
  },
  {
    header: 'Damage Reduction (%)',
    id: 'damageReduction',
    columns: attackTypes.map(attackType => ({
      id: `damageReduction_${attackType.key}`,
      header: getAttackTypeShortName(attackType.key),
      accessorFn: row => <NumberColumn>{row.guard[attackType.key] || ''}</NumberColumn>,
      cell: info => info.getValue(),
    })),
  },
];

type WeaponTypeFilters = Record<WeaponCategoryKey, boolean>;
type InfusionFilters = Record<InfusionKey, boolean>;

type CheckboxProps = {
  label: string;
  checked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const Checkbox: React.FC<CheckboxProps> = (props) => {
  return (
    <label>
      <input
        type="checkbox"
        checked={props.checked}
        onChange={props.onChange}
      />
      {' '}{props.label}
    </label>
  );
};

const ColumnVisibilityCheckbox: React.FC<{ table: Table<any>, column: string, label: string }> = (props) => {
  const { table, column, label } = props;
  return (
    <Checkbox
      label={label}
      checked={table.getColumn(column).getIsVisible()}
      onChange={(e) => {
        table.getColumn(column).getToggleVisibilityHandler()(e);
        table.getColumn(column).getLeafColumns().forEach(leaf => leaf.getToggleVisibilityHandler()(e))
      }}
    />
  );
};

const WeaponTypeFilterCheckbox: React.FC<{ table: Table<any>, label: string, weaponType: WeaponCategoryKey }> = (props) => {
  const { label, table, weaponType } = props;
  const column = table.getColumn('type');
  const filterValue = column.getFilterValue() as WeaponTypeFilters;
  return (
    <Checkbox
      label={label}
      checked={filterValue[weaponType]}
      onChange={(e) => {
        column.setFilterValue({ ...filterValue, [weaponType]: e.currentTarget.checked });
      }}
    />
  );
};

const InfusionFilterCheckbox: React.FC<{ table: Table<any>, label: string, infusion: InfusionKey }> = (props) => {
  const { label, table, infusion } = props;
  const column = table.getColumn('infusion');
  const filterValue = column.getFilterValue() as InfusionFilters;
  return (
    <Checkbox
      label={label}
      checked={filterValue[infusion]}
      onChange={(e) => {
        column.setFilterValue({ ...filterValue, [infusion]: e.currentTarget.checked });
      }}
    />
  );
};

const PageContainer = styled.div`
  display: flex;
`;

const Sidebar = styled.div`
`;

const Main = styled.div`
`;

const WeaponTable = styled.table`
  border-spacing: 0;
`;

const Row = styled.tr<{ index: number }>`
  background-color: ${({ index }) => index % 2 ? '#ccc' : '#fff'};
`;

const HeadRow = styled.tr`
  background: #333;
`;

const Cell = styled.td`
  padding: 3px 6px;
`;

const HeadCell = styled.th`
  padding: 3px 6px;
  color: #fff;
  border: none;
  border-right: 1px solid #888;
`;

function App() {
  const [data] = React.useState(() => [...defaultData]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
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
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [columns] = React.useState<typeof defaultColumns>(() => [
    ...defaultColumns,
  ]);
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      columnFilters,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  return (
    <PageContainer>
      <Sidebar>
        <div>
          <ColumnVisibilityCheckbox table={table} column="requiredAttributes" label="Required Attributes" />
        </div>
        <div>
          <ColumnVisibilityCheckbox table={table} column="type" label="Type" />
        </div>
        <hr />
        <div>
          <div>
            <Checkbox
              label="All"
              checked={Object.values(table.getColumn('type').getFilterValue() as WeaponTypeFilters).some(Boolean)}
              onChange={(e) => {
                table.getColumn('type').setFilterValue(weaponCategories.reduce(
                  (acc, { key }) => ({ ...acc, [key]: e.currentTarget.checked }),
                  {} as WeaponTypeFilters
                ));
              }}
            />
          </div>
          {weaponCategories.map(({ key, name }) => (
            <div>
              <WeaponTypeFilterCheckbox table={table} label={name} key={key} weaponType={key}/>
            </div>
          ))}
        </div>
        <hr />
        <div>
          {infusions.map(({ key, name }) => (
            <div>
              <InfusionFilterCheckbox table={table} label={name} key={key} infusion={key}/>
            </div>
          ))}
        </div>
      </Sidebar>
      <Main>
        <WeaponTable>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <HeadRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <HeadCell key={header.id} colSpan={header.colSpan}>
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
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
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
                  <Cell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Cell>
                ))}
              </Row>
            ))}
          </tbody>
          {/*
          <tfoot>
            {table.getFooterGroups().map(footerGroup => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map(header => (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : flexRender(
                      header.column.columnDef.footer,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
          */}
        </WeaponTable>
      </Main>
    </PageContainer>
  );
}

export default App;
