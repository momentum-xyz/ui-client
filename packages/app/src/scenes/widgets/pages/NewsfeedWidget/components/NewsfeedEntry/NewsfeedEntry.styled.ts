import styled from 'styled-components';

export const Wrapper = styled.div``;

export const Header = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
`;
export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;

  & > * {
    flex: 0;
  }
`;
export const UserInfoTitle = styled.h3`
  font-size: 13px;
  font-weight: 600;
  margin: 0;
  text-transform: uppercase;
  line-height: 18px;
  padding-top: 6px;
`;
export const UserInfoSecondary = styled.div`
  display: flex;
  align-items: center;
  height: 12px;

  font-size: 10px;

  & > span {
    &:first-of-type {
      margin-right: 5px;
    }
    &.world-name {
      color: ${(props) => props.theme.accentText};
    }
    &.separator {
      margin: 0 5px;
    }
  }
`;

export const Content = styled.div`
  padding-left: 18px;
  margin-top: 10px;
`;
export const TextEntryContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;
export const TextEntryText = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.02em;
`;
export const WorldName = styled.a`
  color: ${(props) => props.theme.accentText};
`;
