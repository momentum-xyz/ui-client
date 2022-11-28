import styled from 'styled-components';

export const Wrapper = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: end;
`;

export const Container = styled.div`
  display: flex;
  flex: 1 0 auto;
  border: 1px solid grey;
  margin: 10px;

  :not(&.expanded) {
    width: 679px;
    height: 348px;
    align-self: flex-end;
    flex: 0 0 auto;
  }
`;
