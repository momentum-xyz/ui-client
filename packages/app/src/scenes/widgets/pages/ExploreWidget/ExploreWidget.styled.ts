import styled from 'styled-components';

export const Container = styled.div``;

export const ExplorePanel = styled.div`
  position: relative;

  &.collapsed {
    position: absolute;
    transform: translateX(calc((520px - 30px) * -1));
    top: 10px;

    @media (max-width: 1440px) {
      transform: translateX(calc((520px - 30px) * -1));
    }
  }
`;

export const Wrapper = styled.div`
  position: relative;
  padding: 20px 0 0 0;

  &.collapsed {
    opacity: 0;
  }
`;

export const Tabs = styled.div`
  position: absolute;
  display: flex;
  justify-content: end;
  top: 12px;
  right: 10px;
  left 0;
  z-index: 1;
`;

export const Content = styled.div``;

export const Details = styled.div`
  padding: 0 0 0 40px;
`;
