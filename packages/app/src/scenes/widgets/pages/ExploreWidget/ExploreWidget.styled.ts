import styled from 'styled-components';

export const Container = styled.div`
  --width: var(--widget-width-big);
`;

export const ExplorePanel = styled.div`
  position: relative;
  width: var(--width);

  &.collapsed {
    position: absolute;
    transform: translateX(calc((var(--widget-width-big) - 30px) * -1));
    top: 10px;
  }
`;

export const Wrapper = styled.div`
  position: relative;
`;

export const Tabs = styled.div`
  position: absolute;
  display: flex;
  justify-content: end;
  top: -12px;
  right: 10px;
  left 0;
  z-index: 1;
`;

export const Content = styled.div``;

export const Details = styled.div`
  padding: 0 0 0 40px;
`;
