import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

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

export const Logo = styled.img`
  width: 35%;
  margin: 20px 0;
`;
