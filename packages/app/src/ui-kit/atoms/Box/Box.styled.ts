import styled from 'styled-components';

export const Div = styled.div`
  min-height: 40px;
  border-radius: 8px;
  background: ${(props) => props.theme.bg};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  overflow: hidden;

  &.big {
    width: 255px;
    padding: 10px 0;
  }

  &.normal {
    width: 240px;
    padding: 20px 10px;
  }

  &.small {
    width: 240px;
    padding: 12px;
  }

  &.wide {
    width: 315px;
    padding: 0 15px;
  }
`;
