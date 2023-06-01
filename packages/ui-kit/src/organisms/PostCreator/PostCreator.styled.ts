import styled from 'styled-components';

export const Wrapper = styled.div`
  border-radius: 4px;
`;

export const Header = styled.div`
  display: flex;
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

export const Content = styled.div`
  padding: 10px 0 0 18px;
`;

export const Controls = styled.div`
  padding: 14px 0 0 0;
  display: flex;
  justify-content: flex-end;
`;
