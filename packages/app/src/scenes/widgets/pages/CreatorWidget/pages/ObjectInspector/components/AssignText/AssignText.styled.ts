import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div``;

export const Title = styled.div`
  font-size: var(--font-size-l);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 600;
`;

export const Description = styled.div`
  padding: 12px 0 20px 0;
`;

export const Section = styled.div`
  padding: 20px 0 16px 0;
  border-top: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.4)};
`;

export const ActionBar = styled.div`
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  gap: 40px;

  & > button {
    flex: 1;
    justify-content: center;
    max-width: 156px;
  }
`;
