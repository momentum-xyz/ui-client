import React, {useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {t} from 'i18next';

import {Dialog, Text} from 'ui-kit';
import momentum from 'static/images/momentum.svg';
import flamingo from 'static/images/flamingo.svg';
import {useStore} from 'shared/hooks';

import {Discord, Controls, Momentum, Wiki, Emoji} from './components';
import * as styled from './HelpWidget.styled';
import {IntroVideo} from './components/IntroVideo';

const HelpWidget: React.FC = () => {
  const {widgetStore, mainStore} = useStore();
  const {helpStore} = widgetStore;
  const {worldStore} = mainStore;

  const theme = useTheme();

  useEffect(() => {
    helpStore.init(worldStore.worldId);

    return () => {
      helpStore.resetModel();
    };
  }, [helpStore, worldStore.worldId]);

  return (
    <Dialog
      theme={theme}
      title={t('helpSection.title')}
      headerStyle="uppercase"
      icon="question"
      iconSize="medium-large"
      showCloseButton
      onClose={helpStore.helpDialog.close}
    >
      <styled.Container>
        <styled.TopContainer>
          <styled.Div>
            <styled.MomentumImage src={momentum} />
            <styled.Item>
              <Text text={t('helpSection.helpNote')} size="xs" align="left" />
            </styled.Item>
          </styled.Div>
          <styled.ImageItem>
            <styled.FlamingoImage src={flamingo} />
          </styled.ImageItem>
        </styled.TopContainer>
        <styled.BottomContainer>
          <styled.Item>
            <IntroVideo />
          </styled.Item>
          <styled.Item>
            <Momentum />
          </styled.Item>
          <styled.Item>
            <Controls />
          </styled.Item>
          <styled.Item>
            <Emoji />
          </styled.Item>
          <styled.Item>
            <Wiki />
          </styled.Item>
          <styled.Item>
            <Discord />
          </styled.Item>
        </styled.BottomContainer>
      </styled.Container>
    </Dialog>
  );
};

export default observer(HelpWidget);
