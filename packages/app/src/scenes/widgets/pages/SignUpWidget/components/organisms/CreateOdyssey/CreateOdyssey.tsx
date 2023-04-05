import React, {FC} from 'react';
import {useI18n} from '@momentum-xyz/core';
import {Button, Heading, IconSvg, Text} from '@momentum-xyz/ui-kit';

import {Box} from 'ui-kit';
import image from 'static/images/world.jpg';

import * as styled from './CreateOdyssey.styled';

interface PropsInterface {
  onCreate: () => void;
}

const CreateOdyssey: FC<PropsInterface> = ({onCreate}) => {
  const {t} = useI18n();

  return (
    <Box size="small">
      <styled.Div>
        <styled.Header>
          <IconSvg name="add" size="normal" />
          <Heading type="h3" label={t('actions.createOdyssey')} align="left" />
        </styled.Header>

        <Text size="s" text={t('messages.howSignUp')} align="left" />
        <styled.Image src={image} />

        <Button
          wide
          icon="planet"
          size="medium"
          label={t('actions.createOdyssey')}
          onClick={onCreate}
        />
      </styled.Div>
    </Box>
  );
};

export default CreateOdyssey;
