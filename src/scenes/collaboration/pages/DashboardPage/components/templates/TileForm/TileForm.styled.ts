import styled from 'styled-components';

export const DropDownContainer = styled.div`
  .dropdown-header {
    margin-left: 10px;
    margin-bottom: 5px;
  }
  width: 100%;
  z-index: calc(var(--dialog-z-index) + 1);
`;

export const Container = styled.div`
  z-index: var(--dialog-z-index);
  padding: 0 10px 10px;
  width: 480px;
  margin-bottom: 10px;
  display: grid;
  position: relative;
`;
