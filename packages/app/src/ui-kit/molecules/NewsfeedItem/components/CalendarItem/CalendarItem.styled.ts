import styled from 'styled-components';

export const Info = styled.div`
  padding: 5px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Date = styled.div`
  color: ${(props) => props.theme.accentText};
  font-weight: 400;
  font-size: 8px;
`;

export const Actions = styled.div`
  padding: 2px 0 0 0;
  display: flex;
  gap: 6px;
`;
