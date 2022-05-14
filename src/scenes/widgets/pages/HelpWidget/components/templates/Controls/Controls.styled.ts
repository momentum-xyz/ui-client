import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.3)};
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 0 20px;
  overflow: hidden;
`;
export const BottomContainer = styled.div`
  &.hide {
    display: none;
  }
`;
export const IconsContainer = styled.div``;

export const ItemRowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 10px;
  .IconSvg-custom {
    width: 140px;
    height: 87px;
  }
`;

export const Div = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 20px 0;
`;

export const DropDownIcon = styled.div`
  &.opened {
    transform: rotate(180deg);
  }
  .IconSvg-custom {
    cursor: pointer;
  }
`;

export const TopContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

export const Border = styled.div`
  border: 0.5px solid ${(props) => props.theme.accent};
  margin-bottom: 20px;
`;
export const TextItemTop = styled.div`
  font-size: var(--font-size-s);
  padding-top: 10px;
`;
export const TextItem = styled.div`
  font-size: var(--font-size-s);
`;
export const ServerSpan = styled.span`
  font-size: var(--font-size-s);
  font-weight: bold;
  text-transform: uppercase;
  color: ${(props) => props.theme.accent};
`;

export const Buttons = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
`;

export const ArrowKeysImage = styled.img`
  width: 100%;
  height: 47px;
`;
