import styled from 'styled-components';

import astronautIcon from '../../static/images/astronaut.svg';

export const Container = styled.div<{height: number}>`
  --border-radius: 4px;

  display: flex;
  width: 100%;
  height: ${(props) => props.height}px;
  background-color: ${(props) => props.theme.accentBg};
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius);
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--border-radius);
`;

export const ErroredImage = styled.div`
  width: 100%;
  height: 40%;
  background-color: ${(props) => props.theme.accentText};
  ${`mask: url(${astronautIcon}) no-repeat center;`};
  border-radius: var(--border-radius);
`;
