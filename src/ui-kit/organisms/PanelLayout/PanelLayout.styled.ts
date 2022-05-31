import styled from 'styled-components';
import {rgba} from 'polished';

import {ComponentSizeInterface, Heading} from 'ui-kit';

export const HeaderItem = styled.div<{titleWidth: string}>`
  display: flex;
  overflow: hidden;
  width: ${(props) => props.titleWidth};
  &.centerTitle {
    justify-content: center;
  }
`;

export const TitleHeading = styled(Heading)`
  h4 {
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

export const HeaderIconItem = styled.div`
  display: flex;
  overflow: hidden;
`;

export const Whitespace = styled.div`
  width: 1ch;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 20px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 15px;
  overflow: hidden;
  width: 100%;
  gap: 10px;

  &.noTitle,
  &.normal,
  &.uppercase {
    margin-bottom: 0;
  }

  ${HeaderItem} ~ ${HeaderItem} {
    margin-left: 10px;
  }

  &.divider-uppercase {
    padding-bottom: 15px;
    border-bottom: 1px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 0.5)};
  }
`;

export const Body = styled.div`
  width: 100%;
  height: 100%;
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 15px;

  &.extendToEdges {
    padding: 0;
  }
`;

export const Container = styled.div<ComponentSizeInterface>`
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.8)};
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  position: relative;
  overflow: hidden;

  backdrop-filter: blur(10px);
  border-radius: 10px;

  &.allPointerEvents {
    pointer-events: all;
  }

  &.hasBorder {
    border: 1px solid ${(props) => props.theme.accent};
  }

  ${(props) => props.width && `width: ${props.width}`}
  ${(props) => props.height && `height: ${props.height}`}
  ${(props) => props.maxWidth && `max-width: ${props.maxWidth}`}
  ${(props) => props.maxHeight && `max-height: ${props.maxHeight}`}
`;

export const Spacer = styled.div`
  flex-grow: 1;
`;
