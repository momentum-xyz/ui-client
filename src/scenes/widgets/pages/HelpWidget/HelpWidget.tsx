import React from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {t} from 'i18next';

import {Dialog, Text} from 'ui-kit';
import momentum from 'static/images/momentum.svg';
import flamingo from 'static/images/flamingo.svg';
import {useStore} from 'shared/hooks';

import {Discord, Controls} from './components';
import * as styled from './HelpWidget.styled';

const HelpWidget: React.FC = () => {
  const {widgetStore} = useStore();
  const {helpStore} = widgetStore;

  const theme = useTheme();

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
              <Text text={t('helpSection.formTitle')} size="xxl" align="left" />
            </styled.Item>
            <styled.Item>
              <Text text={t('helpSection.helpNote')} size="xs" align="left" />
            </styled.Item>
          </styled.Div>
          <styled.ImageItem>
            <styled.FlamingoImage src={flamingo} />
          </styled.ImageItem>
        </styled.TopContainer>
        <styled.BottomContainer>
          <styled.DiscordDropDown>
            <Discord />
          </styled.DiscordDropDown>
          <styled.Item>
            <Controls />
          </styled.Item>
        </styled.BottomContainer>
      </styled.Container>
    </Dialog>
  );
};

export default observer(HelpWidget);
