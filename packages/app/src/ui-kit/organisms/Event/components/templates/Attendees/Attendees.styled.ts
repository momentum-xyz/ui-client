import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  margin-top: 20px;
  display: flex;
  position: relative;
  flex-direction: column;
  height: 481px;
  gap: 20px;
  padding: 0 5px;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: 100%;
  width: 100%;
`;

export const Item = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  border-radius: 5px;
  padding: 5px;

  :hover {
    background: rgba(255, 255, 255, 5%);
  }
`;

export const AttendeeContainer = styled.div`
  position: absolute;
  background-color: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.9)};
  left: 530px;
  top: -1px;
`;
