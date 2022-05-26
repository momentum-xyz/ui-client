import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  width: 522px;
  height: 75vh;
  border: none;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 5px;
    height: 40px;
    margin-top: 10px;
  }
  ::-webkit-scrollbar-track {
    display: none;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 6px;
    border: 3px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 0.9)};
    background-clip: content-box;
    max-height: 40px;
  }
  ::-webkit-scrollbar-track-piece:end {
  }

  ::-webkit-scrollbar-track-piece:start {
    margin-top: 20px;
  }
`;

export const TopContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 20px 15px 10px 15px;
`;

export const MomentumImage = styled.img`
  width: 100%;
  height: 47px;
`;

export const FlamingoImage = styled.img`
  height: 230px;
  width: 100%;
`;

export const Div = styled.div`
  width: 301px;
  height: 100%;
`;

export const Item = styled.div`
  padding-top: 20px;
`;
export const ImageItem = styled.div`
  padding-right: 30px;
`;
export const BottomContainer = styled.div`
  padding: 0 5px 0 5px;
  width: 100%;
`;
