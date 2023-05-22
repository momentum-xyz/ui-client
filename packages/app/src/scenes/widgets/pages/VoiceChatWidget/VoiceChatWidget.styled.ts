import styled from 'styled-components';

export const Container = styled.div`
  --actions-offset: 14px;

  position: relative;
  display: flex;
`;

export const Content = styled.div`
  padding: 0;
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`;

export const VoiceChatUsers = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const JoinTitle = styled.div`
  padding: var(--actions-offset) 0 0 0;
  font-weight: 700;
  font-size: var(--font-size-xl);
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  text-transform: uppercase;
`;

export const VoiceChatActions = styled.div`
  padding: var(--actions-offset) 0;
  display: flex;
  justify-content: center;
  gap: 22px;
`;

export const MuteAllAction = styled.div`
  display: flex;
  justify-content: center;

  > button {
    display: flex;
    align-items: center;
    color: ${(props) => props.theme.text};
    gap: 6px;
  }
`;
