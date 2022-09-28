import styled from 'styled-components';

export const BalanceItem = styled.div`
  width: 105px;
  padding: 3px;
  border-radius: 5px;
  text-align: left;
  background-color: ${(props) => props.theme.bg};
`;

export const Usd = styled.div`
  opacity: 0.5;
`;
