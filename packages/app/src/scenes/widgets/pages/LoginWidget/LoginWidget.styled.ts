import styled from 'styled-components';

export const Container = styled.div`
  width: var(--widget-width-normal);
  height: var(--widget-max-height);
  display: flex;
`;

export const PanelContent = styled.div`
  height: calc(var(--widget-max-height) - 100px);
  overflow: scroll;
  padding-bottom: 10px;
`;
