import styled from 'styled-components';
import {PanelLayout, Text} from '@momentum-xyz/ui-kit';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: auto;
`;

export const Body = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin-top: 10px;
  gap: 10px;
`;

export const NoAccess = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

export const Panel = styled(PanelLayout)`
  width: 515px;
  height: 123px;
  justify-content: center;
  align-items: center;
`;

export const Message = styled(Text)`
  height: 100%;
  justify-content: center;
  display: flex;
  align-items: center;
`;
