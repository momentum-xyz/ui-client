import styled from 'styled-components';

export const Number = styled.div`
  height: 28px;
  width: 28px;
  border-radius: 50%;
  background: var(--blue-light);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

export const Inner = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  color: ${(props) => props.theme.accent};
  font-size: var(--font-size-l);
  font-weight: 500;
  opacity: 0.3;

  &.active {
    opacity: 1;
  }
`;
