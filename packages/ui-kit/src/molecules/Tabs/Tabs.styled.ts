import styled from 'styled-components';

export const Tabs = styled.div`
  display: flex;
  gap: 10px;

  &.stick-to-top-right {
    position: absolute;
    display: flex;
    justify-content: end;
    top: -10px;
    right: 10px;
  }
`;
