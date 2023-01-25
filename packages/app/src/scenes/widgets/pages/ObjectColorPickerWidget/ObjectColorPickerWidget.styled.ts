import styled from 'styled-components';

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
  grid-template-columns: 70px 1fr;
  gap: 8px;
`;

export const SelectedColor = styled.div<{background: string}>`
  height: 28px;
  border-radius: 4px;
  background-color: ${(props) => props.background};
`;

export const SelectedHex = styled.div`
  padding: 0 8px 0 0;
  display: flex;
  height: 28px;
  align-items: center;
  justify-content: flex-end;
  border-radius: 4px;
  background-color: var(--blue);
  color: ${(props) => props.theme.text};
  font-size: var(--font-size-s);
  text-transform: uppercase;
`;
