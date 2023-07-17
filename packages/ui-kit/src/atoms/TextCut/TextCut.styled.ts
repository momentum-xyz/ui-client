import styled from 'styled-components';

export const Container = styled.div``;

export const Text = styled.div<{lines: number}>`
  display: -webkit-box;
  -webkit-line-clamp: ${(props) => props.lines};
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: pre-line;
`;

export const Link = styled.a`
  color: ${(props) => props.theme.accentText};
`;
