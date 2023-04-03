import styled from 'styled-components';
import {PanelLayout, Text} from '@momentum-xyz/ui-kit';

export const Connection = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ConnectionTypeText = styled(Text)`
  opacity: 0.5;
`;

export const Buttons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow-y: scroll;
  gap: 10px;
  padding-bottom: 40px;
  padding: 10px;
`;
export const NoConnectionPanel = styled(PanelLayout)`
  width: 100%;
  height: 123px;
  justify-content: center;
  align-items: center;
`;

export const NoConnectionText = styled(Text)`
  height: 100%;
  justify-content: center;
  display: flex;
  align-items: center;
  padding-top: 15px;
`;
