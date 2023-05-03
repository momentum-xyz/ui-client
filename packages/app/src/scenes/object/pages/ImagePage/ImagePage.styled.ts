import styled from 'styled-components';

export const Container = styled.div``;
export const ImageContainer = styled.div`
  position: relative;
  width: 550px;
  height: 550px;
  border-radius: 8px;
  margin-top: 20px;

  & > div {
    height: 100%;
  }
`;
export const PreviewImageHolder = styled.div`
  border: 1px solid ${(props) => props.theme.text};
  background-position: center center;
  background-size: cover;
  position: absolute;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  border-radius: 8px;
`;
