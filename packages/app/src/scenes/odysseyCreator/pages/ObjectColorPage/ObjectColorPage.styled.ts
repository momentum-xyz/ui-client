import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  pointer-events: none;
`;

export const WrapperInner = styled.div`
  width: 300px;
  pointer-events: all;
  margin: 35px 10px;
`;

export const Container = styled.div`
  padding: 10px 0 0 0;

  .rcp {
    padding: 0 15px;
    border-radius: 4px;

    &.rcp-light {
      background-color: transparent;
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
  padding: 0 15px 15px 15px;
  display: grid;
  grid-template-columns: 40px 1fr 1fr 1fr;
  gap: 8px;
`;

export const SelectedColor = styled.div<{background: string}>`
  height: 28px;
  border-radius: 4px;
  background-color: ${(props) => props.background};
`;

export const SelectedHex = styled.div`
  display: flex;
  height: 28px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background-color: var(--blue);
  color: ${(props) => props.theme.text};
  font-size: var(--font-size-s);
  text-transform: uppercase;
`;
