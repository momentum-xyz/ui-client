import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  gap: 20px;
  overflow-y: scroll;
`;

export const Spacer = styled.div``;

export const TemplatesList = styled.div`
  display: grid;
  height: 100%;
  max-height: 70vh;
  grid-template-columns: repeat(5, calc(100% / 5));
  grid-column-gap: 20px;
  width: 100%;
  padding: 0 80px;
`;
