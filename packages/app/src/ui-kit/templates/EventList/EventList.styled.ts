import styled from 'styled-components';

import {PanelLayout, Text} from 'ui-kit';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 10px;
  overflow-y: scroll;
  overflow-x: hidden;
  margin-top: 10px;
  position: relative;

  &.empty {
    justify-content: center;
    align-items: center;
    height: 100%;
  }
`;

export const NoGatheringsPanel = styled(PanelLayout)`
  width: 515px;
  height: 123px;
  justify-content: center;
  align-items: center;
`;

export const NoGatheringsText = styled(Text)`
  height: 100%;
  justify-content: center;
  display: flex;
  align-items: center;
  padding-top: 15px;
`;
