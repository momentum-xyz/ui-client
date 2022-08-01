import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 10px;
  max-height: 80vh;
  max-width: 142vh;
`;

export const Grid = styled.div`
  display: grid;
  width: 100%;
  max-height: 100%;
  align-items: center;

  &.cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  &.cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  &.cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  &.cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

export const MessageContainer = styled.div`
  margin-top: 20px;
  text-align: center;
  opacity: 0.5;
`;

export const RemoteUserActionsContainer = styled.div`
  position: absolute;
  inset: 0;
  display: none;
  justify-content: center;
  align-items: center;
`;

export const MediaPlayerContainer = styled.div`
  width: 100%;
  max-height: 100%;
  aspect-ratio: 16 / 9;
  background: var(--black-100);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &.relative {
    position: relative;
  }

  &.showActionsOnHover {
    :hover {
      ${RemoteUserActionsContainer} {
        display: block;
      }
    }
  }
`;

export const RemoteUserActions = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;

  transition: opacity linear 300ms;

  :hover {
    opacity: 1;
  }
`;

export const RemoteUserAction = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: center;
`;

export const RemoteUserActionButtons = styled.div`
  background: var(--black-70);
  gap: 20px;
  border-radius: 10px;
  padding: 10px;
`;

export const RemoteUserActionButton = styled.button`
  width: 40px;

  :hover {
    ${(props) => props.theme.accent}
  }
`;
