import styled from 'styled-components';

export const Grid = styled.div`
  margin: 0 0 5px 0;
  display: grid;
  grid-template-columns: 50% 50%;
`;

export const Name = styled.div`
  padding: 0;
`;

export const Bar = styled.div`
  padding: 0 0 6px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: right;
`;

export const BarPercent = styled.div`
  color: ${(props) => props.theme.text};
  font-size: 30px;
  font-weight: bold;
`;
