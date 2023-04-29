import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  padding: 10px 0 0 0;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  font-size: var(--icon-size-m);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 600;
  gap: 10px;
`;

export const StakedInUser = styled.div`
  margin: 10px 0 0 0;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.2)};
  box-shadow: -1px -1px 2px ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.1)};
  border-radius: 4px;
  cursor: pointer;
  gap: 10px;
`;

export const Link = styled.a`
  font-size: var(--font-size-s);
  text-decoration: none;
`;

export const ShowAllButtonContainer = styled.div`
  margin: 0 1px;
  padding: 10px 0 0 0;
`;
