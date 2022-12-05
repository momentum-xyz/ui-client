import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {Dialog, SvgButton} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';

import * as styled from './MinimapWidget.styled';

const DIALOG_OFFSET_LEFT = 10;
const DIALOG_OFFSET_BOTTOM = 60;

const MinimapWidget: FC = () => {
  const {mainStore, widgetsStore} = useStore();
  const {minimapStore} = widgetsStore;
  const {unityStore} = mainStore;

  const theme = useTheme();

  useEffect(() => {
    unityStore.showMinimap();

    return () => {
      unityStore.hideMinimap();
    };
  }, [unityStore]);

  return (
    <Dialog
      icon="vector"
      theme={theme}
      position="bottomLeft"
      headerStyle="uppercase"
      offset={{left: DIALOG_OFFSET_LEFT, bottom: DIALOG_OFFSET_BOTTOM}}
      title="NAVIGATION"
      showBackground={false}
      showCloseButton={false}
      isMinimap
    >
      <styled.Container data-testid="MinimapWidget-test">
        <styled.CloseIcon>
          <SvgButton iconName="close" size="normal" onClick={minimapStore.minimapDialog.close} />
        </styled.CloseIcon>
      </styled.Container>
    </Dialog>
  );
};

export default observer(MinimapWidget);
