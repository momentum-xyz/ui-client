import styled from 'styled-components';

export const Preview = styled.div<{previewUrl?: string}>`
  pointer-events: all;
  width: 100%;
  height: 100%;
  border-radius: 4px;

  &.background {
    background: ${(props) =>
      !props.previewUrl
        ? 'linear-gradient(to bottom, #b5bdc8 0%, #828c95 36%, #28343b 100%)'
        : 'none'};
    background-image: ${(props) => (props.previewUrl ? `url(${props.previewUrl})` : 'none')};
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }
`;

export const Error = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export const ProgressBarHolder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 20%;
`;

export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;
export const NestedContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const SnapshotButtonHolder = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 1;
  cursor: pointer;
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
`;
