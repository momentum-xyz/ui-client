import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  --lg-from: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};
  --lg-to: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.56)};
  --lg-header-from: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.6)};
  --lg-header-to: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.12)};

  --radius: 4px;

  --width: initial;
  --primary-width: 400px;
  --secondary-width: 280px;

  width: var(--width);
  background: linear-gradient(180deg, var(--lg-from) 0%, var(--lg-to) 100%);
  box-shadow: -1px -1px 6px rgba(255, 255, 255, 0.2);
  border-radius: var(--radius);

  &.primary {
    --width: var(--primary-width);
  }

  &.secondary {
    --width: var(--secondary-width);
  }

  &.wide {
    --width: 100%;
  }
`;

export const Header = styled.div`
  position: relative;
  padding: 0 10px;
  display: grid;
  background: linear-gradient(180deg, var(--lg-header-from) 0%, var(--lg-header-to) 100%);
  border-radius: var(--radius) var(--radius) 0 0;
  text-transform: uppercase;

  &.primary {
    height: 46px;
    grid-template-columns: 48px 1fr 26px;
    color: ${(props) => props.theme.accentText};
    font-size: var(--font-size-xxl);
    letter-spacing: 0.3em;
    font-weight: 500;
    gap: 10px;
  }

  &.secondary {
    height: 56px;
    grid-template-columns: 36px 1fr 16px;
    color: ${(props) => props.theme.text};
    font-size: var(--font-size-xl);
    letter-spacing: 0.2em;
    gap: 14px;
  }
`;

export const Hexagon = styled.div``;

export const TitleContainer = styled.div`
  min-width: 0;
  flex-direction: column;
  justify-content: center;
  align-self: center;
  align-items: start;
  overflow: hidden;
`;

export const Title = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Label = styled.div`
  font-size: var(--font-size-xs);
  font-weight: 400;
`;

export const Actions = styled.div`
  display: flex;

  &.primary {
    align-items: center;
    justify-content: center;

    svg {
      color: ${(props) => props.theme.accentText};
    }
  }

  &.secondary {
    padding: 10px 0 0 0;

    svg {
      color: ${(props) => props.theme.text};
    }
  }
`;

export const Content = styled.div`
  padding: 10px 10px 40px 10px;
`;
