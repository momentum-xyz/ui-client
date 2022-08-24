import styled from 'styled-components';
import {rgba} from 'polished';

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: start;
`;

export const DescriptionBox = styled.div`
  padding: 20px 0 80px;
  border-bottom: 1px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 1)};
`;

export const InstructionBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
  padding: 0 0 60px;
  border-bottom: 1px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 1)};
`;

export const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
`;

export const TextWrapper = styled.div`
  color: ${(props) => props.theme.text};
  font-size: var(--font-size-m);
  width: 100%;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: start;
  padding-top: 5px;
`;
