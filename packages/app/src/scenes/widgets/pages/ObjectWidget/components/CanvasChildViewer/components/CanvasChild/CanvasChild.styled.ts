import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div``;

export const Header = styled.div`
  padding: 0 0 10px 0;
  display: flex;
  color: ${(props) => props.theme.text};
  gap: 10px;
`;

export const SubHeader = styled.div`
  font-size: var(--font-size-xl);
  text-transform: uppercase;
  letter-spacing: 3.2px;
  font-weight: 700;

  > span {
    display: block;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 350px;
    white-space: nowrap;
  }
`;

export const Description = styled.div`
  line-height: 22px;
  letter-spacing: 0.28px;
`;

export const Separator = styled.div`
  margin: 10px 0;
  height: 1px;
  background: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
`;

export const BoldText = styled.div`
  padding: 6px 0;
  font-size: var(--font-size-s);
  text-transform: uppercase;
  letter-spacing: 1.3px;
  font-weight: 600;

  > span {
    display: block;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 350px;
    white-space: nowrap;
  }
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
  font-weight: 400;
  gap: 2px;
`;

export const Wrapper = styled.div`
  position: relative;
`;

export const Title = styled.div`
  padding: 0 0 10px 0;
  font-size: var(--font-size-xl);
  font-weight: 700;
  letter-spacing: 3.2px;
  text-transform: uppercase;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const Grid = styled.div`
  margin: 0 0 20px 0;
  padding: 0 0 20px 0;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
  gap: 10px;
`;

export const Opinion = styled.div`
  padding: 2px 0 0 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const CommentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;
