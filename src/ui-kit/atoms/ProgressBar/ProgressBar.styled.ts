import styled from 'styled-components';

export const ProgressBar = styled.div`
  height: 4px;
  width: 100%;
  background: var(--black-100);
`;

export const BarLine = styled.div`
  height: 4px;
  border-radius: 4px;
  background: ${(props) => props.theme.accent};
`;
