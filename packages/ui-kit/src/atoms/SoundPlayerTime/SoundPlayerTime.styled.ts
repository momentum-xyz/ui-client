import styled from 'styled-components';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 40px auto 40px;
  color: ${(props) => props.theme.text};
  font-size: var(--font-size-s);
  align-items: center;
  gap: 4px;
`;

export const Played = styled.div`
  text-align: right;
`;

export const Duration = styled.div`
  text-align: left;
`;
