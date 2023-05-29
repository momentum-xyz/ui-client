import styled from 'styled-components';

export const Wrapper = styled.div`
  pointer-events: all;
`;

export const MenuItemContainer = styled.div`
  display: flex;
  flex-direction: column;

  &.inverted {
    align-items: flex-end;
  }
`;
export const MenuItem = styled.button`
  display: flex;
  align-items: center;
  padding-left: 17px;
  position: relative;

  & > button {
    margin-right: 10px;
  }

  &.inverted {
    flex-direction: row-reverse;
    padding-left: 0px;
    padding-right: 17px;
    & > button {
      margin-right: 0px;
      margin-left: 10px;
    }
  }
`;
export const MenuItemNumberPin = styled.div`
  position: absolute;
  top: 0;
  left: 48px;
  background: ${(props) => props.theme.danger};

  border-radius: 100%;
  height: 24px;
  width: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 9px;
  font-weight: bold;
  font-family: 'Poppins';
  color: ${(props) => props.theme.text};

  &.inverted {
    left: auto;
  }
`;

export const MenuItemSeparator = styled.div`
  display: flex;
`;
