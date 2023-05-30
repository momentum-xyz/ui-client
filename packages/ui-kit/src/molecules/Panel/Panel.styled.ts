import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  --lg-from: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};
  --lg-to: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.56)};
  --lg-header-from: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.6)};
  --lg-header-to: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.12)};

  --height-offset: 165px;
  --radius: 4px;

  --color: initial;
  --primary-color: ${(props) => props.theme.accentText};
  --secondary-color: ${(props) => props.theme.text};

  --offset: 0;
  --primary-offset: 14px;
  --secondary-offset: 6px;

  margin: var(--offset) 0 0 0;
  background: linear-gradient(180deg, var(--lg-from) 0%, var(--lg-to) 100%);
  box-shadow: -1px -1px 6px rgba(255, 255, 255, 0.2);
  border-radius: var(--radius);
  pointer-events: all;

  &.primary {
    --offset: var(--primary-offset);
  }

  &.secondary {
    --offset: var(--secondary-offset);
  }

  /* SIZES */

  &.size-small {
    width: 280px;
  }

  &.size-normal {
    width: 400px;

    @media (max-width: 1440px) {
      width: 400px;
    }
  }

  &.size-large {
    width: 520px;

    @media (max-width: 1440px) {
      width: 520px;
    }
  }

  &.size-wide {
    width: 100%;
  }
`;

export const Header = styled.div`
  position: relative;
  padding: 0 10px;
  display: grid;
  background: linear-gradient(180deg, var(--lg-header-from) 0%, var(--lg-header-to) 100%);
  border-radius: var(--radius) var(--radius) 0 0;
  text-transform: uppercase;
  color: var(--color);

  &.primary {
    --color: var(--primary-color);

    height: 46px;
    grid-template-columns: 48px 1fr 26px;
    font-size: var(--font-size-xxl);
    letter-spacing: 0.3em;
    font-weight: 500;
    gap: 10px;
  }

  &.secondary {
    --color: var(--secondary-color);

    height: 56px;
    grid-template-columns: 36px 1fr 16px;
    font-size: var(--font-size-xl);
    letter-spacing: 0.2em;
    gap: 14px;
  }
`;

export const Hexagon = styled.div`
  > * {
    top: calc(-1 * var(--offset));
    position: absolute;
  }

  svg {
    color: var(--color);
  }
`;

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
  justify-content: center;

  &.primary {
    align-items: center;

    svg {
      color: ${(props) => props.theme.accentText};
    }
  }

  &.secondary {
    padding: 12px 0 0 0;
    align-items: start;

    svg {
      color: ${(props) => props.theme.text};
    }
  }
`;

export const ScrollableContainer = styled.div<{offset: number}>`
  padding: 10px;
  color: ${(props) => props.theme.text};

  &.fullHeight {
    height: calc(100vh - var(--height-offset) - ${(props) => props.offset}px);
    overflow: scroll;
  }
`;

export const TopComponent = styled.div`
  position: relative;
`;

export const BottomComponent = styled.div`
  position: relative;
`;
