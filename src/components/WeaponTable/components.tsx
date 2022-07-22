import styled from 'styled-components';
import { A } from '../../components/components';
import * as i from '../../components/icons';
import { fonts } from '../../style';

export const NumberColumn = styled.span`
  font-family: ${fonts.mono};
  display: block;
  text-align: right;
`;

export const WeaponLink: React.FC<{ href: string, name: string }> = (props) => {
  const { name, href } = props;
  return (
    <A target="_blank" href={href} style={{ display: 'inline-flex', alignItems: 'center', textAlign: 'right', whiteSpace: 'nowrap' }}>
      <span style={{ marginRight: '3px' }}>{name}</span>
      <i.ExternalLink size="0.8em" color="#666" />
    </A>
  )
};
