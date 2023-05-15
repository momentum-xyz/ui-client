import {rgba} from 'polished';
import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  pointer-events: none;
`;

export const WrapperInner = styled.div`
  width: 100%;
  pointer-events: all;
  margin: 35px 10px;
`;

export const Container = styled.div`
  width: 100%;
  padding: 10px 0 0 0;

  .rcp {
    padding: 0 15px;
    border-radius: 4px;

    &.rcp-light {
      background-color: transparent;
      padding: 0;
    }
  }

  .rcp-saturation {
    border-radius: 4px;
  }

  .rcp-body {
    padding: 10px 0 10px 0;
  }

  .rcp-hue {
    height: 8px;

    .rcp-hue-cursor {
      width: 10px;
      height: 10px;
      border: 1px solid var(--white);
      transform: translate(-4px, -1px);
    }
  }
`;

export const ColorContainer = styled.div`
  display: flex;
  grid-template-columns: 40px 1fr 1fr 1fr;
  gap: 8px;
`;

export const SelectedColor = styled.div<{background: string}>`
  height: 40px;
  width: 70px;
  flex: 0 0 70px;
  border-radius: 4px;
  background-color: ${(props) => props.background};
  border: 1px solid ${(props) => props.theme.accentText};
`;

export const SelectedHex = styled.div`
  display: flex;
  flex: 1;
  height: 40px;
  padding: 0 20px;
  align-items: center;
  border-radius: 4px;
  color: ${(props) => props.theme.text};
  font-size: var(--font-size-s);
  text-transform: uppercase;
  border: 1px solid ${(props) => props.theme.accentText};
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.4)};
`;
