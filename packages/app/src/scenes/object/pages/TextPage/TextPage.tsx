import React, {FC} from 'react';
import {Button, Heading, SvgButton} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {generatePath, useNavigate, useParams} from 'react-router-dom';
import ReactLinkifyOriginal, {Props as ReactLinkifyProps} from 'react-linkify';
import {useI18n} from '@momentum-xyz/core';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {ChangeTextDialog} from 'scenes/object/components';

import * as styled from './TextPage.styled';

const ReactLinkify = ReactLinkifyOriginal as unknown as FC<ReactLinkifyProps>;

const TextPage: FC = () => {
  const navigate = useNavigate();
  const {objectStore, unityStore} = useStore();
  const {assetStore} = objectStore;
  const {changeTileDialog, content} = assetStore;

  const isAdmin = unityStore.isCurrentUserWorldAdmin;

  const {worldId} = useParams<{worldId: string}>();

  const {t} = useI18n();

  return (
    <styled.Modal data-testid="TextPage-test">
      {changeTileDialog.isOpen && <ChangeTextDialog />}
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
              label={content?.title ? content?.title : t('labels.document')}
              transform="uppercase"
            />
          </styled.Title>
        </styled.HeaderElement>
        {isAdmin && (
          <styled.HeaderElement className="button">
            <Button label={t('actions.changeText')} onClick={changeTileDialog.open} />
          </styled.HeaderElement>
        )}
        <styled.HeaderElement className="right">
          <styled.Button>
            <SvgButton
              iconName="close"
              size="large"
              isWhite
              onClick={() => {
                navigate(generatePath(ROUTES.odyssey.base, {worldId}));
              }}
            />
          </styled.Button>
        </styled.HeaderElement>
      </styled.Container>
    </styled.Modal>
  );
};

export default observer(TextPage);
