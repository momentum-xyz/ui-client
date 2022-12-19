import React, {FC} from 'react';
import {Button, Heading, SvgButton} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {generatePath, useHistory, useParams} from 'react-router-dom';
import ReactLinkify from 'react-linkify';
import {useTranslation} from 'react-i18next';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {ChangeTextDialog} from 'scenes/object/components';

import * as styled from './TextPage.styled';

const TextPage: FC = () => {
  const history = useHistory();
  const {objectStore} = useStore();
  const {tileStore} = objectStore;
  const {changeTileDialog, content} = tileStore;

  const {worldId} = useParams<{worldId: string}>();

  const {t} = useTranslation();

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
        <styled.HeaderElement className="button">
          <Button label={t('actions.changeText')} onClick={changeTileDialog.open} />
        </styled.HeaderElement>
        <styled.HeaderElement className="right">
          <styled.Button>
            <SvgButton
              iconName="close"
              size="large"
              isWhite
              onClick={() => {
                history.push(generatePath(ROUTES.odyssey.base, {worldId}));
              }}
            />
          </styled.Button>
        </styled.HeaderElement>
      </styled.Container>
    </styled.Modal>
  );
};

export default observer(TextPage);
