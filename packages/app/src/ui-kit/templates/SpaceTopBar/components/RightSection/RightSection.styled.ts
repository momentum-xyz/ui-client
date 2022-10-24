import styled from 'styled-components';

export const MessageCount = styled.span`
  position: absolute;
  color: ${(props) => props.theme.accent};
  top: 12px;
  margin-left: 21px;

  height: 5px;
  width: 5px;
  border-radius: 50%;
  background-color: rgba(255, 174, 99, 0.9);
  color: transparent;
`;
