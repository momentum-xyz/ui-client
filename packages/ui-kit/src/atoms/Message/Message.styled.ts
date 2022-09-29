import styled from 'styled-components';

const Message = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 6px 11px;
  border-width: 1px;
  border-style: solid;
  border-radius: 5px;
`;

export const InfoMessage = styled(Message)`
  background-color: ${(props) => props.theme.accentDanger};
  border-color: rgba(255, 255, 255, 0.5);
`;
export const WarningMessage = styled(Message)`
  background-color: ${(props) => props.theme.accentWarning};
  border-color: rgba(255, 255, 255, 0.5);
`;
export const DangerMessage = styled(Message)`
  background-color: ${(props) => props.theme.accentDanger};
  border-color: rgba(255, 255, 255, 0.5);
`;
export const NeutralMessage = styled(Message)`
  background-color: ${(props) => props.theme.accentDanger};
  border-color: rgba(255, 255, 255, 0.5);
`;
export const SuccessMessage = styled(Message)`
  background-color: ${(props) => props.theme.accent};
  border-color: rgba(255, 255, 255, 0.5);
`;
