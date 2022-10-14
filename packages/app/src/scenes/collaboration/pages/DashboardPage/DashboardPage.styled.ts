import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
  width: var(--space-page-width);
  height: 100%;
  overflow: hidden;
  pointer-events: auto;
`;

export const AlertContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  margin-top: 5px;
  padding: 15px 15px;
  border-radius: 10px;
  background: var(--danger-red-50);
  border: 1px solid var(--danger-red);
`;
export const AlertContent = styled.div`
  margin-left: 15px;
`;

export const MessageCount = styled.span`
  position: absolute;
  color: ${(props) => props.theme.accent};
  top: 12px;
  margin-left: 21px;
`;
