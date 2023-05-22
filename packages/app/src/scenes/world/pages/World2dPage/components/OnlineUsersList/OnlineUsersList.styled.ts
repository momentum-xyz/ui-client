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

export const Wrapper = styled.div``;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Link = styled.a`
  padding: 0;
`;

export const Actions = styled.div`
  padding: 10px 10px 0 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
