import {FC} from 'react';
import {Heading} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import ReactLinkifyOriginal, {Props as ReactLinkifyProps} from 'react-linkify';

import {useStore} from 'shared/hooks';

import * as styled from './TextPage.styled';

const ReactLinkify = ReactLinkifyOriginal as unknown as FC<ReactLinkifyProps>;

const TextPage: FC = () => {
  const {objectStore} = useStore();
  const {assetStore} = objectStore;
  const {content} = assetStore;

  return (
    <styled.ContentWrapper>
      <Heading type="h2" label={content?.title || ''} transform="uppercase" align="left" />
      <ReactLinkify
        componentDecorator={(decoratedHref: string, decoratedText: string, key: number) => (
          <a href={decoratedHref} key={key} target="_blank" rel="noreferrer">
            {decoratedText}
          </a>
        )}
      >
        <styled.TextTile>{content?.content}</styled.TextTile>
      </ReactLinkify>
    </styled.ContentWrapper>
  );
};

export default observer(TextPage);
