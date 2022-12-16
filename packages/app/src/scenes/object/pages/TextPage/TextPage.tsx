import React, {FC, useCallback, useState} from 'react';
import {Button, Heading, Input, SvgButton} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {generatePath, useHistory, useParams} from 'react-router-dom';
import ReactLinkify from 'react-linkify';
import {useTranslation} from 'react-i18next';

import {ROUTES} from 'core/constants';
import {ObjectInterface} from 'api';
import {useStore} from 'shared/hooks';

import * as styled from './TextPage.styled';

interface PropsInterface {
  content?: ObjectInterface;
  worldId: string;
}

const TextPage: FC<PropsInterface> = ({content, worldId}) => {
  const history = useHistory();
  const {mainStore, objectStore} = useStore();
  const {unityStore} = mainStore;

  const {t} = useTranslation();

  const {objectId} = useParams<{objectId: string}>();

  const [isChangeTextOpen, setIsChangeTextOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleFocus = useCallback(() => {
    unityStore.changeKeyboardControl(false);
  }, [unityStore]);

  const handleBlur = useCallback(() => {
    unityStore.changeKeyboardControl(true);
  }, [unityStore]);

  return (
    <styled.Modal data-testid="TextPage-test">
      {isChangeTextOpen && (
        <styled.ChangeTextForm>
          <Heading label={t('labels.changeText')} type="h2" />
          <Input onFocus={handleFocus} onBlur={handleBlur} onChange={setTitle} />
          <Input onFocus={handleFocus} onBlur={handleBlur} onChange={setNewContent} />
          <Button
            label={t('actions.change')}
            onClick={async () => {
              await objectStore.postNewContent(objectId, {
                title,
                content: newContent
              });

              setIsChangeTextOpen(false);
            }}
          />
          <Button
            label={t('actions.cancel')}
            variant="danger"
            onClick={() => {
              setIsChangeTextOpen(false);
            }}
          />
        </styled.ChangeTextForm>
      )}
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
          <Button label={t('actions.changeText')} onClick={() => setIsChangeTextOpen(true)} />
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
