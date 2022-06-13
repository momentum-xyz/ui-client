import styled from 'styled-components';

import {PanelLayout} from 'ui-kit';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 10px;
`;

export const Body = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

export const PanelLayoutCustom = styled(PanelLayout)`
  display: flex;
  width: 515px;
  height: 123px;
  justify-content: center;
  align-items: center;

  *:first-child {
    margin-top: calc(123px / 4 - 5px);
  }
`;
