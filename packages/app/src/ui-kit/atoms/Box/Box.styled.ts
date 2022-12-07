import styled from 'styled-components';

export const Div = styled.div`
  width: 270px;
  min-height: 40px;
  border-radius: 8px;
  background: ${(props) => props.theme.bg};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  overflow: hidden;

  &.normal {
    padding: 20px 10px;
  }

  &.small {
    padding: 10 0;
  }
`;
