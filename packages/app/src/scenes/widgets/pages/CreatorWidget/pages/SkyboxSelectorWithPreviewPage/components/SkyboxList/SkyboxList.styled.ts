import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

export const SkyboxContainer = styled.button`
  width: 180px;
`;
export const SkyboxInnerContainer = styled.button`
  display: flex;
  flex-direction: column;
  gap: 10px;

  & > span {
    width: 160px;
    text-align: center;
    color: ${(props) => props.theme.text};
    letter-spacing: 0.08em;
    text-transform: uppercase;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;
