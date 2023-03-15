import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  --lg-from: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.2)};
  --lg-to: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0)};
  --offset: 18px;

  margin: var(--offset) 0 0 0;
`;

export const Inner = styled.div`
  position: relative;
  padding: 10px;
  background: linear-gradient(180deg, var(--lg-from) 0%, var(--lg-to) 100%);
  border-radius: 4px;
`;

export const Steps = styled.div`
  display: flex;
  position: absolute;
  top: calc(-1 * var(--offset));
  right: 0;
  gap: 10px;
`;
