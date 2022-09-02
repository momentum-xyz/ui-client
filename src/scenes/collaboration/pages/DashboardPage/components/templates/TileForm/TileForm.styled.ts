import styled from 'styled-components';

import {Heading} from 'ui-kit';

export const DropDownContainer = styled.div`
  width: 100%;
  z-index: calc(var(--dialog-z-index) + 1);
`;

export const DropdownHeading = styled(Heading)`
  margin-left: 10px;
  margin-bottom: 5px;
`;

export const Container = styled.div`
  z-index: var(--dialog-z-index);
  padding: 0 10px 10px;
  width: 480px;
  margin-bottom: 10px;
  display: grid;
  position: relative;
`;
