import styled from 'styled-components';

export const ColorControl = styled.div``;
export const ColorControlsTitle = styled.div`
  margin-bottom: 11px;
`;

export const ColorControls = styled.div`
  display: flex;
  flex-direction: column;

  ${ColorControl} ~ ${ColorControl} {
    margin-top: 16px;
  }
`;
