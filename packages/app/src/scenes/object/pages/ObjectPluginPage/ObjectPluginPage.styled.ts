import styled from 'styled-components';

export const Wrapper = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: end;
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
