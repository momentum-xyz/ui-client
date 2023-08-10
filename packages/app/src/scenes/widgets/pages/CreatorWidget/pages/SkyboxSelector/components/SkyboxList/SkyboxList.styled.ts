import styled from 'styled-components';

export const Container = styled.div``;

export const Inner = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
`;

export const SkyboxLoader = styled.div`
  height: 100px;
`;

export const SkyboxContainer = styled.button`
  position: relative;
  width: 152px;
`;

export const SkyboxInnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const SkyboxName = styled.span`
  width: 140px;
  text-align: center;
  color: ${(props) => props.theme.text};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const RemoveIcon = styled.div`
  position: absolute;
  right: 16px;
  top: 16px;
`;
