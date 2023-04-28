import styled from 'styled-components';

export const Container = styled.div`
  --scroll-offset: 455px;
`;

export const Wrapper = styled.div`
  padding: 0;
`;

export const GeneralScrollable = styled.div`
  margin: 0 10px;
  display: flex;
  height: calc(100vh - var(--scroll-offset));
  flex-direction: column;
  overflow: auto;
`;

export const TitleContainer = styled.div`
  padding: 10px 0 0 0;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  font-size: var(--icon-size-m);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 600;
  gap: 10px;
`;

export const TotalAmount = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
