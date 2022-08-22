import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  z-index: var(--dialog-z-index);
  overflow: auto;
  padding-right: 10px;
  padding-left: 10px;
  margin: 10px;
  width: 522px;
  height: 60vh;
  .SearchInput-custom {
    background: ${rgba(0, 1, 1, 0.2)};
  }
  position: relative;
`;

export const DropDownContainer = styled.div`
  .Heading-custom {
    margin-left: 10px;
    margin-bottom: 5px;
  }
  padding-top: 120px;
  padding-right: 20px;
  width: 100%;
  position: absolute;
  padding-bottom: 20px;
  z-index: calc(var(--dialog-z-index) + 1);
`;

export const LoaderContainer = styled.div`
  z-index: var(--dialog-z-index);
  display: flex;
  width: 522px;
  height: 60vh;
  align-items: center;
  justify-content: center;
`;

export const Div = styled.div`
  display: grid;
`;

export const TextItem = styled.div``;

export const BottomContainer = styled.div`
  position: absolute;
  padding-top: 180px;
  padding-right: 20px;
  width: 100%;
  z-index: var(--dialog-z-index);
`;
export const HeadingItem = styled.div`
  padding-top: 20px;
`;

export const TokenDetailGrid = styled.div`
  padding-top: 30px;
  width: 100%;
  .Heading-custom {
    color: var(--white);
    width: 30%;
    padding: 0 0 0 0;
  }

  .Text-custom {
    color: ${(props) => props.theme.accent};
    width: 30%;
    margin-bottom: 1px;
  }
`;

export const GridItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0 10px 20px;

  .Text-custom {
    white-space: nowrap;
  }
`;

export const TextWrapper = styled.div`
  background: #132247;
  margin: 0 0 0 20px;
  width: 100%;
  padding: 10px;
  border-radius: 6px;
`;
