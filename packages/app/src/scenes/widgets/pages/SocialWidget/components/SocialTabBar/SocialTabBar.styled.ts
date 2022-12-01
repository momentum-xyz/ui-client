import {Heading} from '@momentum-xyz/ui-kit';
import {rgba} from 'polished';
import styled from 'styled-components';

interface PropsInterface {
  selectedTabIndex: number;
  numberOfTabs: number;
}

export const Container = styled.div`
  display: flex;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  height: 36px;
  width: 100%;
  background: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.1)};
`;

export const TabSelectorContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  pointer-events: none;
`;

export const TabsContainer = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
`;

export const TabsLabelsContainer = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

export const TabLabelContainer = styled.div`
  display: flex;
  flex-grow: 1;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

export const TabSelector = styled.div<PropsInterface>`
  position: relative;
  width: calc(100% / ${({numberOfTabs}) => numberOfTabs});
  height: 100%;
  left: calc(${(props) => props.selectedTabIndex} * (100% / ${(props) => props.numberOfTabs}));

  transition: left ease-in 0.2s;

  background: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.1)};
  border-radius: 10px;
`;

export const Tab = styled.button<PropsInterface>`
  display: flex;
  width: calc(100% / ${({numberOfTabs}) => numberOfTabs});
  height: 100%;
`;

export const TabHeading = styled(Heading)`
  :not(&.selected) {
    color: ${(props) => props.theme.text};
  }

  &.active {
    text-decoration: underline;
  }
`;
