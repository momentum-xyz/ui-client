import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  pointer-events: auto;
  width: 100%;
  margin: 10px;

  &.withMeeting {
    width: var(--space-page-width);
    margin: 10px 10px 0 0;
  }
`;
