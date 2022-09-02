import styled from 'styled-components';

import {Heading} from 'ui-kit';

export const Container = styled.div`
  z-index: var(--dialog-z-index);
  overflow: auto;
  padding-right: 10px;
  padding-left: 10px;
  margin: 10px;
  width: 522px;
  height: 60vh;
  position: relative;
`;

export const LoaderContainer = styled.div`
  z-index: var(--dialog-z-index);
  display: flex;
  width: 522px;
  height: 60vh;
  align-items: center;
  justify-content: center;
`;

export const Div = styled.div`
  display: grid;
`;

export const TextItem = styled.div`
  padding-bottom: 20px;
`;

export const DropDownContainer = styled.div`
  padding-bottom: 20px;
`;

export const DropdownLabel = styled(Heading)`
  margin-left: 10px;
  margin-bottom: 5px;
`;

export const Item = styled.div`
  padding-bottom: 20px;
`;

export const HeadingItem = styled.div`
  padding-bottom: 20px;
  margin-left: 10px;
`;

export const ErrorText = styled.div`
  padding-bottom: 20px;
  color: black;
`;
