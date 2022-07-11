import React from 'react';
import './App.css';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { weapons } from './data';
import { Weapon } from './types';

const defaultData = weapons;

const columns: ColumnDef<Weapon>[] = [
  {
    header: () => <span>Name</span>,
    accessorFn: row => row.name,
    id: 'nameeeee',
    cell: info => info.getValue(),
    footer: info => info.column.id,
  },
  {
    header: () => <span>Name5</span>,
    accessorFn: row => row.name,
    id: 'nameeeee',
    cell: info => info.getValue(),
    footer: info => info.column.id,
  },
];

function App() {
  const [data] = React.useState(() => [...defaultData]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <table>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        {table.getFooterGroups().map(footerGroup => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map(header => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.footer,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </tfoot>
    </table>
  );
}

export default App;
