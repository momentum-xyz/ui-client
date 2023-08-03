import {FC} from 'react';
import Linkify from 'react-linkify';

import * as styled from './TextLinkify.styled';

export interface TextLinkifyPropsInterface {
  text: string;
}

const TextLinkify: FC<TextLinkifyPropsInterface> = ({text}) => {
  return (
    <styled.Container data-testid="TextLinkify-test">
      <Linkify
        componentDecorator={(decoratedHref: string, decoratedText: string, key: number) => (
          <a href={decoratedHref} key={key} target="_blank" rel="noreferrer">
            {decoratedText}
          </a>
        )}
      >
        <styled.Description>{text}</styled.Description>
      </Linkify>
    </styled.Container>
  );
};

export default TextLinkify;
