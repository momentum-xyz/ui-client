import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  --lg-from: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.2)};
  --lg-to: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0)};

  padding: 10px;
  display: flex;
  background: linear-gradient(180deg, var(--lg-from) 0%, var(--lg-to) 100%);
  box-shadow: -1px -1px 2px 0px rgba(158, 238, 255, 0.1);
  color: ${(props) => props.theme.text};
  border-radius: 4px;
  flex-direction: column;
  gap: 12px;
`;

export const Title = styled.div`
  padding: 10px 0 0 0;
  font-size: var(--font-size-l);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 600;
`;

export const Content = styled.div`
  font-size: var(--font-size-m);
  letter-spacing: 0.02em;
  line-height: 22px;
  font-weight: 400;
`;
