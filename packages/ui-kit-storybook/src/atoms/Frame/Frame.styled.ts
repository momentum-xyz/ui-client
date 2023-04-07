import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  --lg-from: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.2)};
  --lg-to: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0)};

  padding: 10px;
  background: linear-gradient(180deg, var(--lg-from) 0%, var(--lg-to) 100%);
  color: ${(props) => props.theme.text};
  border-radius: 4px;
`;
