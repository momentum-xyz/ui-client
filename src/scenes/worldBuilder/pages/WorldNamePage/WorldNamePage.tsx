import {observer} from 'mobx-react-lite';
import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';

import {WorldBuilderFooter, WorldBuilderHeader} from 'scenes/worldBuilder/components';
import {Text} from 'ui-kit';

import * as styled from './WorldNamePage.styled';

const WorldNamePage: FC = () => {
  const {t} = useTranslation();
  return (
    <styled.Container>
      <styled.Spacer />
      <WorldBuilderHeader />
      <styled.FormContainer>
        <styled.FormFieldContainer>
          <styled.InputLabel label="Name World" transform="uppercase" type="h1" align="right" />
          <styled.InputStyled
            type="dark"
            placeholder="Name your world"
            errorMessage="There is already a metaverse with that name - please try again"
            isError
          />
          <Text
            text="This is the name of the metaverse you will be creating"
            size="xl"
            align="left"
          />
        </styled.FormFieldContainer>
        <styled.FormFieldContainer>
          <styled.InputLabel label="World URL" transform="uppercase" type="h1" align="right" />
          <styled.InputStyled
            type="dark"
            placeholder="worldname.momentum.xyz"
            errorMessage="There is already a metaverse at that location - please try again"
            isError
          />
          <Text
            text="This is the publicly facing URL that people will visit when then visiting your metaverse"
            size="xl"
            align="left"
          />
        </styled.FormFieldContainer>
      </styled.FormContainer>
      <WorldBuilderFooter currentStep={0} buttonLabel={t('actions.selectTemplate')} />
    </styled.Container>
  );
};

export default observer(WorldNamePage);
