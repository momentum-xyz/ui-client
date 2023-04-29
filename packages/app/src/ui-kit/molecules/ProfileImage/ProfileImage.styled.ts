import styled from 'styled-components';

export const Container = styled.div`
  padding: 0;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Name = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: var(--font-size-xl);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 700;
`;

export const Link = styled.a`
  padding: 0;
`;
