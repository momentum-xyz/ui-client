import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.95)};
  border-radius: 8px;
`;

export const Header = styled.div`
  padding: 14px 12px 24px 12px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

export const Name = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const Body = styled.div`
  display: flex;
  overflow: hidden;
  width: 285px;
`;

export const Wrapper = styled.div`
  width: 100%;
`;

export const Loader = styled.div`
  padding: 0;
  width: 100%;
  height: 150px;
`;
