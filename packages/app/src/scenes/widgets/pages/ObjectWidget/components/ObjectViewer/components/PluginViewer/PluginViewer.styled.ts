import styled from 'styled-components';

export const Wrapper = styled.div`
  flex: 1 0 auto;
  display: flex;
  width: 100%;
  height: 320px;
  flex-direction: column;
  align-items: stretch;
`;

export const Container = styled.div`
  display: flex;
  flex: 1 0 auto;
  align-self: flex-end;

  &.expanded {
    margin-top: 20px;
    width: 100%;
    height: calc(100% - 20px);
  }

  :not(&.expanded) {
    width: 679px;
    height: 348px;
    flex: 0 0 auto;
  }

  transition: all 0.2s ease-in-out;
`;

export const HeadingWrapper = styled.div`
  padding: 10px 0;
`;

export const ContentWrapper = styled.div`
  flex: 1 0 auto;
`;

export const Title = styled.div`
  text-transform: uppercase;
  font-size: var(--font-size-l);
  font-weight: 600;
  line-height: 22px;
  letter-spacing: 3px;
`;
