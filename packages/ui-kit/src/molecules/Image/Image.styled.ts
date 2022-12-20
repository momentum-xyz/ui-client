import styled from 'styled-components';

import {ComponentSizeInterface} from '../../interfaces';

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
`;

export const Loader = styled.img``;
export const ErroredImage = styled.img``;
