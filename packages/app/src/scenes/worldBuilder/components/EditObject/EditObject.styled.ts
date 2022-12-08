import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  pointer-events: none;
`;

export const Container = styled.div`
  width: 300px;
  pointer-events: all;

  margin: 35px 100px;
`;

export const PanelBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 10px;
`;
