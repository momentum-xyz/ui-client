import React, {FC, useState} from 'react';
import {Button, Heading, SvgButton, Text, FileUploader} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {generatePath, useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

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
  const {objectStore} = useStore();
  //const {unityStore} = mainStore;
  const history = useHistory();
  const {t} = useTranslation();

  const {objectId} = useParams<{objectId: string}>();

  const [isChangeImageShown, setIsChangeImageShown] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [image, setImage] = useState<File>();

  return (
    <styled.Modal data-testid="ImagePage-test">
      {isChangeImageShown && (
        <styled.ChangeImageForm>
          <Heading label={t('labels.changeImage')} type="h2" />
          {!image && (
            <FileUploader
              label={t('actions.selectImage')}
              dragActiveLabel={t('actions.dropItHere')}
              fileType="image"
              buttonSize="normal"
              onFilesUpload={setImage}
              onError={(error) => console.error(error)}
              enableDragAndDrop={false}
            />
          )}
          {image /* TODO: FileUploader 'selected' file state */ && (
            <Button label={image.name} disabled={true} />
          )}
          <Button
            label={isProcessing ? `${t('messages.processing')}...` : t('actions.change')}
            disabled={isProcessing}
            onClick={async () => {
              if (image) {
                setIsProcessing(true);
                await objectStore.postNewImage(objectId, image);
                setIsChangeImageShown(false);
                setIsProcessing(false);
              }
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
              text={content?.title ? content?.title : t('labels.image')}
              transform="uppercase"
              weight="bold"
              size="xl"
            />
          </styled.Title>
        </styled.HeaderElement>
        <styled.HeaderElement className="button">
          <Button label={t('actions.changeImage')} onClick={() => setIsChangeImageShown(true)} />
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
