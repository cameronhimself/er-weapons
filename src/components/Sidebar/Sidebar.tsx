import React from 'react';
import styled from 'styled-components';
import { Table } from '@tanstack/react-table';
import { infusions, weaponTypes } from '../../data/';
import { InfusionKey, WeaponTypeKey } from '../../types';
import { InfusionFilters, WeaponTypeFilters } from '../WeaponTable';
import * as icons from '../icons';
import { CheckBox as Checkbox } from 'grommet';
import useCollapse from 'react-collapsed'

const StyledSidebar = styled.div`
  flex-shrink: 0;
  margin-right: 20px;
  position: sticky;
  top: 20px;
  align-self: flex-start;
  min-width: 200px;
  overflow-y: auto;
  max-height: calc(100vh - 40px);
`;

const StyledSectionHeading = styled.div`
  font-size: 16px;
  margin-bottom: 5px;
  cursor: pointer;
  vertical-align: middle;
  :focus {
    outline: none;
  }
  > svg {
    vertical-align: middle;
  }
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

const SectionHeading: React.FC<{ onClick: () => void, children: React.ReactNode }> = props => {
  return (
    <StyledSectionHeading {...props} />
  );
};

const Section: React.FC<{ heading: string, children?: React.ReactNode, isOpen?: boolean }> = props => {
  const { heading, children, isOpen: isOpenInitial = true } = props;
  const [isOpen, setIsOpen] = React.useState(isOpenInitial);
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse({ isExpanded: isOpen });
  return (
    <StyledSection>
      <SectionHeading {...getToggleProps()} onClick={() => setIsOpen(!isOpen)}>
        {heading} <icons.CollapsibleOpen size="15px" style={{ transition: 'transform 0.3s', transform: isExpanded ? 'rotate(0)' : 'rotate(-90deg)' }}/>
        </SectionHeading>
      <div {...getCollapseProps()}>
        {children}
      </div>
    </StyledSection>
  );
};

const ColumnVisibilityCheckbox: React.FC<{ table: Table<any>, column: string, label: string, disabled: boolean}> = (props) => {
  const { table, column, label, disabled } = props;
  return !disabled && (
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
