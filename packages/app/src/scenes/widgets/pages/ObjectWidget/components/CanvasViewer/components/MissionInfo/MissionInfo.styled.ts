import styled from 'styled-components';

export const Container = styled.div``;

export const Header = styled.div`
  padding: 0 0 12px 0;
  display: flex;
  align-items: center;
  font-size: var(--font-size-l);
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 600;
  gap: 10px;

  span {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;
