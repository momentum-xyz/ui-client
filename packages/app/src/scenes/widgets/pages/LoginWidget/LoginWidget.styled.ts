import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  display: flex;
`;

export const Content = styled.div`
  padding: 12px 0 0 0;
`;

export const Steps = styled.div`
  position: absolute;
  right: 20px;
  top: 64px;
`;

export const Title = styled.div`
  padding: 12px 0 0 0;
  font-size: var(--font-size-l);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 600;
`;

export const Desc = styled.div`
  padding: 12px 0 12px 0;
  line-height: 22px;
`;
