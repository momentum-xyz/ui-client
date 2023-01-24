import styled from 'styled-components';

import {ComponentSizeInterface} from '../../interfaces';
import astronautIcon from '../../static/images/astronaut.svg';

export const Container = styled.div<ComponentSizeInterface>`
  display: flex;
  align-items: center;
  justify-content: center;
  ${(props) => props.width && `width: ${props.width};`}
  ${(props) => props.height && `height: ${props.height};`}
  ${(props) => props.maxWidth && `max-width: ${props.maxWidth};`}
  ${(props) => props.maxHeight && `max-height: ${props.maxHeight};`}
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

export const Loader = styled.img``;

export const ErroredImage = styled.div`
  width: 85%;
  height: 85%;
  background-color: ${(props) => props.theme.accent};
  ${`mask: url(${astronautIcon}) no-repeat center;`};
  border-radius: 50%;
`;
