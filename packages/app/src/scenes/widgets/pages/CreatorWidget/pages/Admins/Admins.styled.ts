import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div``;

export const Head = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`;

export const Title = styled.div`
  font-size: var(--font-size-l);
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 600;
`;

export const Text = styled.div`
  line-height: 22px;
`;

export const UserList = styled.div``;

export const UserItem = styled.div`
  margin: 10px 0 0 0;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.2)};
  box-shadow: -1px -1px 2px ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.1)};
  border-radius: 4px;
  cursor: pointer;
  gap: 10px;
`;

export const UserName = styled.div`
  font-size: var(--font-size-l);
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: uppercase;
`;

export const ItemAction = styled.div`
  margin-left: auto;
`;

export const CircleButton = styled.div`
  display: flex;
  width: 20px;
  height: 20px;
  padding: 4.667px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  background: ${(props) => props.theme.accentBg};
  border: 0.4px solid var(--white);
  border-radius: 50%;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  &:hover {
    background: ${(props) => props.theme.accentText};
  }
  & > * {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1 0 0;
    align-self: stretch;
  }
`;
