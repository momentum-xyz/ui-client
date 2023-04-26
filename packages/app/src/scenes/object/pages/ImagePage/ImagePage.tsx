import React, {FC} from 'react';
import {SvgButton, Text} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {generatePath, useNavigate} from 'react-router-dom';
import {useI18n} from '@momentum-xyz/core';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
// import {ChangeImageDialog} from 'scenes/object/components';

import * as styled from './ImagePage.styled';

const ImagePage: FC = () => {
  const {objectStore, universeStore} = useStore();
  const {assetStore} = objectStore;
  const {
    // changeTileDialog,
    content,
    imageSrc
  } = assetStore;

  // const isAdmin = universeStore.isCurrentUserWorldAdmin;

  const navigate = useNavigate();
  const {t} = useI18n();

  const {worldId} = universeStore;

  return (
    <styled.Modal data-testid="ImagePage-test">
      {/* {changeTileDialog.isOpen && <ChangeImageDialog />} */}
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
        {/* {isAdmin && (
          <styled.HeaderElement className="button">
            <Button label={t('actions.changeImage')} onClick={changeTileDialog.open} />
          </styled.HeaderElement>
        )} */}
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

export default observer(ImagePage);
