import React, {FC} from 'react';
import {Button, SvgButton, Text} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {generatePath, useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {ChangeImageDialog} from 'scenes/object/components';

import * as styled from './ImagePage.styled';

const ImagePage: FC = () => {
  const {objectStore} = useStore();
  const {tileStore} = objectStore;
  const {changeTileDialog, content, imageSrc} = tileStore;
  const history = useHistory();
  const {t} = useTranslation();

  const {worldId} = useParams<{worldId: string}>();

  return (
    <styled.Modal data-testid="ImagePage-test">
      {changeTileDialog.isOpen && <ChangeImageDialog />}
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
          <Button label={t('actions.changeImage')} onClick={changeTileDialog.open} />
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
