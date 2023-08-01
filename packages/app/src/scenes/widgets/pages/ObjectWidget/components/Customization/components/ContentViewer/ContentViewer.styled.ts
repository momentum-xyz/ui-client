import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div``;

export const Header = styled.div`
  display: flex;
  color: ${(props) => props.theme.text};
  gap: 10px;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

export const UserInfoTitle = styled.h3`
  margin: 0;
  font-size: var(--font-size-s);
  font-weight: 600;
  text-transform: uppercase;
  line-height: 18px;
`;

export const UserName = styled.div`
  width: 300px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const Date = styled.div`
  display: flex;
  align-items: center;
  font-size: var(--font-size-xxs);
  color: ${(props) => props.theme.text && rgba(props.theme.text, 0.8)};
  font-weight: 400;
  gap: 2px;
`;

export const Wrapper = styled.div`
  position: relative;
  padding: 10px 0 0 18px;
`;

export const Title = styled.div`
  padding: 0 0 10px 0;
  font-size: var(--font-size-xl);
  font-weight: 700;
  letter-spacing: 3.2px;
  text-transform: uppercase;
`;

export const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Opinion = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Description = styled.div`
  white-space: pre-line;
`;

export const Controls = styled.div`
  padding: 20px 0 0 0;
  display: flex;
  justify-content: space-between;
`;
