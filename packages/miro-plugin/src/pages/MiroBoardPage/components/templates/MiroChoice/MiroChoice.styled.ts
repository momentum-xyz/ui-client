import styled from 'styled-components';
import {rgba} from 'polished';

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.8)};
  overflow: hidden;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
`;

export const Button = styled.button`
  background: ${(props) => props.theme.accent};
  color: ${(props) => props.theme.text};
  padding: 5px 10px;
  border-radius: 10px;
`;

export const Text = styled.p`
  color: ${(props) => props.theme.text};
`;
