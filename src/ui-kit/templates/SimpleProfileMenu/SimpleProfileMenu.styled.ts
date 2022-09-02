import styled from 'styled-components';

export const Container = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const Option = styled.button`
  display: flex;
  padding: 10px 20px;
  align-items: center;
  gap: 10px;
  width: 167px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  :hover {
    background: rgba(255, 255, 255, 10%);
  }
`;

export const IconContainer = styled.div`
  width: 20px;
  display: flex;
  justify-content: center;
`;

export const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  z-index: var(--overlay-z-index);
  padding: 0 10px 10px 20px;
  right: 0;
`;
