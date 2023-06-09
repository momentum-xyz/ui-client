import styled from 'styled-components';

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

export const World = styled.div`
  display: flex;
  align-items: center;
  font-size: var(--font-size-xxs);
  font-weight: 400;
  gap: 2px;
`;

export const Icon = styled.div`
  padding: 0 2px 0 0;
`;

export const WorldName = styled.div`
  max-width: 165px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  color: ${(props) => props.theme.accentText};
`;
