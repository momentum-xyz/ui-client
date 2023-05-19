import styled from 'styled-components';

export const Container = styled.div`
  padding: 10px 0 0 0;
`;

export const ImageContainer = styled.div`
  margin: 10px 0 0 0;
  position: relative;
  width: 100%;
  height: 500px;
  border-radius: 8px;

  & > div {
    height: 100%;
  }
`;
export const PreviewImageHolder = styled.div`
  border: 1px solid ${(props) => props.theme.text};
  background-position: center center;
  background-size: cover;
  position: absolute;
  width: 100%;
  height: calc(100% - 20px);
  border-radius: 4px;
`;
