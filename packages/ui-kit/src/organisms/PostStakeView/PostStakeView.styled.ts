import styled from 'styled-components';

export const Container = styled.div``;

export const Wrapper = styled.div`
  position: relative;
  padding: 10px 0 0 18px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 36px 1fr;
  align-items: center;
  line-height: 20px;
  gap: 10px;
`;

export const WorldName = styled.a`
  color: ${(props) => props.theme.text};
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    text-decoration: none;
  }
`;

export const Description = styled.div``;
