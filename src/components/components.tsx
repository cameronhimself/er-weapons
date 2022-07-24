import React from 'react';
import styled from 'styled-components';
import { fonts } from '../style';
import * as i from '../components/icons';

export const Mono = styled.span`
  font-family: ${fonts.mono};
`;

export const A = styled.a`
  color: inherit;
`;

const StyledExternalLink = styled(A)`
  display: inline-flex;
  alignItems: center;
  text-align: right;
  white-space: nowrap;
`;

export const ExternalLink: React.FC<React.HTMLProps<HTMLAnchorElement>> = (props) => {
  const { children, ref, as, ...rest } = props;
  return (
    <StyledExternalLink target="_blank" {...rest}>
      <span style={{ marginRight: '3px' }}>{children}</span>
      <i.ExternalLink size="0.8em" color="#666" />
    </StyledExternalLink>
  );
};
