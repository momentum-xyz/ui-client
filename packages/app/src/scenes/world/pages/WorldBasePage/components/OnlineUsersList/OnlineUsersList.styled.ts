import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
`;

export const ActiveUserContainer = styled.div`
  position: absolute;
  left: 60px;
  top: 0;
`;

export const Wrapper = styled.div`
  margin: -20px 0 0 0;
`;

export const Info = styled.div`
  padding: 0 10px;
`;

export const Actions = styled.div`
  padding: 20px 10px 0 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
