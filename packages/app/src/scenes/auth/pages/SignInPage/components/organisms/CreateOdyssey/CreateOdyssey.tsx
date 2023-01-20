import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Heading, IconSvg, Text} from '@momentum-xyz/ui-kit';

import {Box} from 'ui-kit';
import image from 'static/images/world.svg';

import * as styled from './CreateOdyssey.styled';

interface PropsInterface {
  onCreate: () => void;
}

const CreateOdyssey: FC<PropsInterface> = ({onCreate}) => {
  const {t} = useTranslation();

  return (
    <Box size="small">
      <styled.Div>
        <styled.Header>
          <IconSvg name="add" size="normal" />
          <Heading type="h3" label={t('actions.createOdyssey')} align="left" />
        </styled.Header>

        <Text size="s" text={t('messages.howSignUp')} align="left" />
        <styled.Image src={image} />
        <div>
          <Text size="s" text={t('messages.signUp')} align="left" />
        </div>

        <Button
          wide
          icon="wallet"
          size="medium"
          label={t('actions.installWallet')}
          onClick={onCreate}
        />
      </styled.Div>
    </Box>
  );
};

export default CreateOdyssey;
