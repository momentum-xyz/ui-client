import {rgba} from 'polished';
import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 670px;
  width: 928px;
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.85)};
  pointer-events: all;

  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(2px);
  padding: 15px 10px;
  border-radius: 10px;
  overflow: hidden;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  align-items: center;
`;

export const Body = styled.div`
  display: flex;
  flex-grow: 1;
  overflow: hidden;
`;

export const PageContainer = styled.div`
  flex-grow: 1;
  padding: 0 5px;
`;
