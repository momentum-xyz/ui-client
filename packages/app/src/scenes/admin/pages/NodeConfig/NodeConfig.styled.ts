import styled from 'styled-components';

export const Container = styled.div`
  padding: 10px;
  max-width: 850px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 0 10px 10px;
  position: relative;
  height: 100%;
`;

export const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 10px 0;
`;
