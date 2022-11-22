import styled from 'styled-components';

export const Div = styled.div`
  display: flex;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${(props) => props.theme.bg};
  align-items: center;
  justify-content: center;
`;
