import {rgba} from 'polished';
import styled from 'styled-components';

export const Modal = styled.div`
  display: flex;
  position: absolute;
  right: 0;
  top: 0;
  margin: 20px;
`;

export const Container = styled.div`
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.9)};
  border-radius: 10px;
  overflow: hidden;
  width: 280px;
  height: 584px;

  display: flex;
  flex-direction: column;
  pointer-events: all;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 0.1)};
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.9)};
`;

export const HeaderItemsGroup = styled.div`
  display: flex;
  gap: 10px;
`;

export const TabsSelector = styled.div`
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.9)};
  padding: 15px 20px;
`;

export const Body = styled.div`
  flex-grow: 1;
  overflow: hidden;
`;
