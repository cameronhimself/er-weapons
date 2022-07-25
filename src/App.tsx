import React from 'react';
import styled from 'styled-components';
import {
  WeaponTable,
  Sidebar,
  useWeaponTable,
} from './components';
import { fonts } from './style';
import { Grommet } from 'grommet';

const ContentContainer = styled.div`
  display: flex;
  margin: 20px;
  justify-content: center;
`;

const PageContainer = styled.div`
  display: flex;
`;

const Main = styled.div`
`;

const theme = {
  global: {
    colors: {
      brand: '#56829F',
      focus: 'transparent',
    },
    font: {
      family: fonts.base,
      size: '14px',
      height: '20px',
    },
  },
  checkBox: {
    size: '16px',
  },
  tip: {
    content: {
      background: 'black',
    },
  }
};

const App: React.FC = () => {
  const table = useWeaponTable();
  return (
    <Grommet theme={theme}>
      <PageContainer>
        <ContentContainer>
          <Sidebar table={table} />
          <Main>
            <WeaponTable table={table} />
          </Main>
        </ContentContainer>
      </PageContainer>
    </Grommet>
  );
}

export default App;
