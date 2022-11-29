import styled from 'styled-components';

export const InnerContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  min-height: 0;
  flex-direction: column;
  align-items: flex-start;
`;

export const Container = styled.div`
  border-radius: 10px;
  pointer-events: all;

  padding-top: 60px;
  width: 100%;
  height: 100%;
`;

export const Modal = styled.div`
  position: absolute;
  display: flex;
  width: 96%;
  height: 90%;
  pointer-events: all;
  top: 2%;
  left: 2%;
  margin: 0;
  padding-top: 60px;
  border-radius: 10px;
  background: ${(props) => props.theme.bg};

  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  z-index: calc(var(--dialog-z-index) + 1);

  :not(&.expanded) {
    position: absolute;
    flex-direction: column;
    width: 679px;
    height: 348px;
    margin: 0;
    top: unset;
    left: unset;
    right: 20px;
    bottom: 61px;
  }
`;

export const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  padding: 5px 20px;
  opacity: 0.8;

  height: 60px;
  gap: 20px;
  top: 0;
  &.left {
    left: 0;
    gap: 5px;
  }
  &.right {
    right: 0;
  }
`;

export const Title = styled.div`
  min-width: 0;
`;
export const SubTitle = styled.div`
  min-width: 0;
`;
