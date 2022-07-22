import React from 'react';
import styled from 'styled-components';
import { Table } from '@tanstack/react-table';
import {
  InfusionFilters,
  WeaponTable,
  WeaponTypeFilters,
  useWeaponTable,
} from './components';
import {
  infusions,
  weaponCategories,
} from './data';
import {
  InfusionKey,
  WeaponCategoryKey,
} from './types';

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

const ContentContainer = styled.div`
  display: flex;
  margin: 20px;
  justify-content: center;
`;

const PageContainer = styled.div`
  display: flex;
`;

const Sidebar = styled.div`
  flex-shrink: 0;
  margin-right: 20px;
  opacity: 0;
  height: 1px;
  overflow: hidden;
`;

const FloatingSidebar = styled(Sidebar)`
  opacity: 1;
  height: auto;
  position: fixed;
  left: 10px;
  z-index: 1;
  overflow: hidden;
`;

const Main = styled.div`
`;

function App() {
  const table = useWeaponTable();
  return (
    <PageContainer>
      <ContentContainer>
        <FloatingSidebar>
          <div>
            <ColumnVisibilityCheckbox table={table} column="requiredAttributes" label="Required Attributes" />
          </div>
          <div>
            <ColumnVisibilityCheckbox table={table} column="type" label="Type" />
          </div>
          <hr />
          <div>
            <div>
              <h4>Options</h4>
              <div>
                <Checkbox
                  label="Group by Category"
                  checked={table.getColumn('type').getIsGrouped()}
                  onChange={table.getColumn('type').getToggleGroupingHandler()}
                />
              </div>
              <div>
                <Checkbox
                  label="Group by Infusion"
                  checked={table.getColumn('infusion').getIsGrouped()}
                  onChange={table.getColumn('infusion').getToggleGroupingHandler()}
                />
              </div>
            </div>
            <hr />
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
              <div key={key}>
                <WeaponTypeFilterCheckbox table={table} label={name} key={key} weaponType={key}/>
              </div>
            ))}
          </div>
          <hr />
          <div>
            {infusions.map(({ key, name }) => (
              <div key={key}>
                <InfusionFilterCheckbox table={table} label={name} key={key} infusion={key}/>
              </div>
            ))}
          </div>
        </FloatingSidebar>
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
              <div key={key}>
                <WeaponTypeFilterCheckbox table={table} label={name} key={key} weaponType={key}/>
              </div>
            ))}
          </div>
          <hr />
          <div>
            {infusions.map(({ key, name }) => (
              <div key={key}>
                <InfusionFilterCheckbox table={table} label={name} key={key} infusion={key}/>
              </div>
            ))}
          </div>
        </Sidebar>
        <Main>
          <WeaponTable table={table} />
        </Main>
      </ContentContainer>
    </PageContainer>
  );
}

export default App;
