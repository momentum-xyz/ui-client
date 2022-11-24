import React, {FC} from 'react';
import {Heading, SvgButton} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';
import ReactLinkify from 'react-linkify';

import {ROUTES} from 'core/constants';
import {ObjectInterface} from 'api';

import * as styled from './TextPage.styled';

interface PropsInterface {
  content?: ObjectInterface;
}

const TextPage: FC<PropsInterface> = ({content}) => {
  const history = useHistory();

  return (
    <styled.Modal data-testid="TextPage-test">
      <styled.Container>
        <styled.ContentWrapper>
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
        <styled.HeaderElement className="left">
          <styled.Title>
            <Heading
              type="h2"
              label={content?.title ? content?.title : 'Document'}
              transform="uppercase"
            />
          </styled.Title>
        </styled.HeaderElement>
        <styled.HeaderElement className="right">
          <styled.Button>
            <SvgButton
              iconName="close"
              size="large"
              isWhite
              onClick={() => {
                history.push(ROUTES.base);
                console.info('????');
              }}
            />
          </styled.Button>
        </styled.HeaderElement>
      </styled.Container>
    </styled.Modal>
  );
};

export default observer(TextPage);
