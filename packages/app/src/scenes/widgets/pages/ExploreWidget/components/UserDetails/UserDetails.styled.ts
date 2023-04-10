import styled from 'styled-components';

export const Container = styled.div`
  --scroll-offset: 460px;

  width: var(--widget-width-normal);
  height: var(--widget-max-height);
`;

export const Wrapper = styled.div`
  padding: 0;
`;

export const GeneralScrollable = styled.div`
  padding: 0 10px;
  display: flex;
  max-height: calc(100vh - var(--scroll-offset));
  flex-direction: column;
  overflow: auto;
  gap: 10px;
`;

export const OdysseyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  font-size: var(--icon-size-m);
  letter-spacing: 0.2em;
  font-weight: 600;
  gap: 10px;
`;
