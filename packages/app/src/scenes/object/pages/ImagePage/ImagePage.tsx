import React, {FC, useState, useCallback} from 'react';
import {Button, Heading, SvgButton, Text, Input} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {generatePath, useHistory, useParams} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {ObjectInterface} from 'api';
import {useStore} from 'shared/hooks';

import * as styled from './ImagePage.styled';

interface PropsInterface {
  imageSrc?: string;
  content?: ObjectInterface;
  worldId: string;
}

const ImagePage: FC<PropsInterface> = ({imageSrc, content, worldId}) => {
  const {objectStore, mainStore} = useStore();
  const {unityStore} = mainStore;
  const history = useHistory();

  const {objectId} = useParams<{objectId: string}>();

  const [isChangeImageShown, setIsChangeImageShown] = useState(false);
  const [image, setImage] = useState('');

  const handleFocus = useCallback(() => {
    unityStore.changeKeyboardControl(false);
  }, [unityStore]);

  const handleBlur = useCallback(() => {
    unityStore.changeKeyboardControl(true);
  }, [unityStore]);

  return (
    <styled.Modal data-testid="ImagePage-test">
      {isChangeImageShown && (
        <styled.ChangeImageForm>
          <Heading label="Change Image" type="h2" />
          <Input onFocus={handleFocus} onBlur={handleBlur} onChange={setImage} />
          <Button
            label="Change"
            onClick={() => {
              objectStore.postNewContent(objectId, {
                render_hash: image
              });
            }}
          />
          <Button
            label="Cancel"
            variant="danger"
            onClick={() => {
              setIsChangeImageShown(false);
            }}
          />
        </styled.ChangeImageForm>
      )}
      <styled.Container>
        <styled.ContentWrapper>
          {imageSrc && <styled.ImageWrapper src={imageSrc} alt="" />}
        </styled.ContentWrapper>
        <styled.HeaderElement className="left">
          <styled.Title>
            <Text
              text={content?.title ? content?.title : 'Image'}
              transform="uppercase"
              weight="bold"
              size="xl"
            />
          </styled.Title>
        </styled.HeaderElement>
        <styled.HeaderElement className="button">
          <Button label="Change image" onClick={() => setIsChangeImageShown(true)} />
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

export default observer(ImagePage);
