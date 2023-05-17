import styled from 'styled-components';

export const ProgressBar = styled.div`
  height: 4px;
  width: 100%;
  border-radius: 4px;
  background: ${(props) => props.theme.text};
`;

export const BarLine = styled.div`
  height: 4px;
  border-radius: 4px;
  background: ${(props) => props.theme.accentText};
`;
