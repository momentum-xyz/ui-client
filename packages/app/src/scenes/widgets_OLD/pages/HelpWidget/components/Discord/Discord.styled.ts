import styled from 'styled-components';

export const TextItemTop = styled.div`
  font-size: var(--font-size-s);
  padding-top: 10px;
`;

export const TextItemBottom = styled.div`
  font-size: var(--font-size-s);
  padding-top: 20px;
  width: 90%;
`;

export const ServerSpan = styled.span`
  font-size: var(--font-size-m);
  font-weight: bold;
  color: ${(props) => props.theme.accentText};
  cursor: pointer;
`;

export const Buttons = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
`;
