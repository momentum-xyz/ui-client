import {rgba} from 'polished';
import styled from 'styled-components';

export const MenuLabel = styled.span`
  --gradient-background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.4)};

  color: ${(props) => props.theme.text};
  font-family: 'Poppins';
  text-transform: uppercase;
  letter-spacing: 0.3em;

  &.right {
    background: linear-gradient(90deg, var(--gradient-background) 0%, transparent 100%);
    padding: 4px 20px 4px 10px;
  }
  &.left {
    background: linear-gradient(90deg, transparent 0%, var(--gradient-background) 100%);
    padding: 4px 10px 4px 20px;
  }

  &.bold {
    font-weight: 700;
  }
`;
