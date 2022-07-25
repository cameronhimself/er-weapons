import React from 'react';
import styled from 'styled-components';
import { Table } from '@tanstack/react-table';
import { infusions, weaponTypes } from '../../data/';
import { InfusionKey, WeaponTypeKey } from '../../types';
import { InfusionFilters, WeaponTypeFilters } from '../WeaponTable';
import { CheckBoxGroup, CheckBox as Checkbox, Collapsible } from 'grommet';

const StyledSidebar = styled.div`
  flex-shrink: 0;
  margin-right: 20px;
  position: sticky;
  top: 20px;
  align-self: flex-start;
  min-width: 180px;
`;

type CheckboxProps = {
  label: string;
  checked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

// const Checkbox: React.FC<CheckboxProps> = (props) => {
//   return (
//     <label>
//       <input
//         type="checkbox"
//         checked={props.checked}
//         onChange={props.onChange}
//       />
//       {' '}{props.label}
//     </label>
//   );
// };

const SectionHeading = styled.div`
  font-size: 18px;
  margin-bottom: 8px;
`;

const StyledSection = styled.div`
  border-bottom: 1px solid #555;
  padding: 10px 0;
  :first-child {
    padding-top: 0;
  }
  :last-child {
    border-bottom: none;
  }
`;

const Section: React.FC<{ heading: string, children?: React.ReactNode, isOpen?: boolean }> = props => {
  const { heading, children, isOpen: isOpenInitial = true } = props;
  const [isOpen, setIsOpen] = React.useState(isOpenInitial);
  return (
    <StyledSection>
      <SectionHeading onClick={() => setIsOpen(!isOpen)}>{heading}</SectionHeading>
      <Collapsible open={isOpen}>
        {children}
      </Collapsible>
    </StyledSection>
  );
};

const ColumnVisibilityCheckbox: React.FC<{ table: Table<any>, column: string, label: string, disabled: boolean}> = (props) => {
  const { table, column, label, disabled } = props;
  return (
    <Checkbox
      disabled={disabled}
      label={label}
      checked={table.getColumn(column).getIsVisible()}
      onChange={(e) => {
        table.getColumn(column).getToggleVisibilityHandler()(e);
        table.getColumn(column).getLeafColumns().forEach(leaf => leaf.getToggleVisibilityHandler()(e))
      }}
    />
  );
};

const WeaponTypeFilterCheckbox: React.FC<{ table: Table<any>, label: string, weaponType: WeaponTypeKey }> = (props) => {
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

const toggleGrouping = (id: string, table: Table<any>) => {
  const groupingState = table.getState().grouping;
  const removing = groupingState.includes(id);
  let newGroupingState = removing
    ? groupingState.filter(g => g !== id)
    : [...groupingState, id];
  if (id === 'type' && newGroupingState.includes('infusion')) {
    newGroupingState = [...newGroupingState.filter(g => g !== 'infusion'), 'infusion'];
  }
  table.setGrouping(newGroupingState);

  const visibilityState = table.getState().columnVisibility;
  if (!visibilityState[id]) {
    table.setColumnVisibility({ ...visibilityState, [id]: true });
  }
};

export const Sidebar: React.FC<{ table: Table<any> }> = (props) => {
  const { table } = props;
  const weaponTypeFilters = Object.values(table.getColumn('type').getFilterValue() as WeaponTypeFilters);
  return (
    <>
      <StyledSidebar>
        <Section heading="Group by">
          <div>
            <Checkbox
              label="Weapon Type"
              checked={table.getColumn('type').getIsGrouped()}
              onChange={() => toggleGrouping('type', table)}
            />
          </div>
          <div>
            <Checkbox
              label="Infusion"
              checked={table.getColumn('infusion').getIsGrouped()}
              onChange={() => toggleGrouping('infusion', table)}
            />
          </div>
        </Section>
        <Section heading="Types">
          <div>
            <Checkbox
              label="All"
              checked={weaponTypeFilters.every(Boolean)}
              indeterminate={weaponTypeFilters.some(Boolean) && !weaponTypeFilters.every(Boolean)}
              onChange={(e) => {
                table.getColumn('type').setFilterValue(weaponTypes.reduce(
                  (acc, { key }) => ({ ...acc, [key]: e.currentTarget.checked }),
                  {} as WeaponTypeFilters
                ));
              }}
            />
          </div>
          {weaponTypes.map(({ key, name }) => (
            <div key={key}>
              <WeaponTypeFilterCheckbox table={table} label={name} key={key} weaponType={key}/>
            </div>
          ))}
        </Section>
        <Section heading="Infusions">
          {infusions.map(({ key, name }) => (
            <div key={key}>
              <InfusionFilterCheckbox table={table} label={name} key={key} infusion={key}/>
            </div>
          ))}
        </Section>
        <Section heading="Columns" isOpen={false}>
          {table.getAllColumns().map(col => (
            <ColumnVisibilityCheckbox
              key={col.id}
              disabled={Boolean(table.getState().grouping.find(g => g === col.id))}
              table={table}
              column={col.id}
              label={col.columnDef.header as string}
            />
          ))}
        </Section>
      </StyledSidebar>
    </>
  );
};
