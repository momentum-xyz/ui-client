import React, {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {Button, Dialog, Image} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import {getImageAbsoluteUrl} from 'core/utils';

import * as styled from './PreviewOdysseyWidget.styled';

const OFFSET_BOTTOM = 400;

const PreviewOdysseyWidget: FC = () => {
  const {widgetsStore} = useStore();
  const {previewOdysseyStore} = widgetsStore;
  const {nft} = previewOdysseyStore;

  const navigate = useNavigate();
  const {t} = useTranslation();

  const handleTeleport = useCallback(() => {
    const worldId = nft?.uuid || '';
    navigate(generatePath(ROUTES.odyssey.base, {worldId}));
    previewOdysseyStore.dialog.close();
  }, [navigate, nft, previewOdysseyStore]);

  if (!nft) {
    return <></>;
  }

  return (
    <Dialog
      position="center"
      title={nft.name || ''}
      offset={{bottom: OFFSET_BOTTOM}}
      showBackground={false}
      headerStyle="uppercase"
      headerType="h1"
      hasBottomPadding={false}
      shortTopPadding
      layoutSize={{width: '280px'}}
      onClose={previewOdysseyStore.resetModel}
      showCloseButton
    >
      <styled.Container data-testid="PreviewOdysseyWidget-test">
        <Image
          src={getImageAbsoluteUrl(nft.image) || ''}
          sizeProps={{width: '80px', height: '80px'}}
        />
        <div>
          <Button
            size="normal"
            label={t('actions.visit')}
            icon="fly-portal"
            noWhitespaceWrap
            wide
            onClick={handleTeleport}
          />
        </div>
      </styled.Container>
    </Dialog>
  );
};

export default observer(PreviewOdysseyWidget);
