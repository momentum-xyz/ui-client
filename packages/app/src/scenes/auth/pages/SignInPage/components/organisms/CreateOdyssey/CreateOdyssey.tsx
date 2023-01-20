import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Text} from '@momentum-xyz/ui-kit';

import {Box} from 'ui-kit';
import {appVariables} from 'api/constants';
import image from 'static/images/world.svg';

import * as styled from './CreateOdyssey.styled';

interface PropsInterface {
  onCreate: () => void;
}

const CreateOdyssey: FC<PropsInterface> = ({onCreate}) => {
  const {t} = useTranslation();

  const discoverUrl = `${appVariables.DISCOVER_URL_PROTOCOL}://${appVariables.DISCOVER_URL_DOMAIN}`;

  return (
    <Box>
      <styled.Div>
        <Text size="m" text={t('actions.createOdyssey')} align="left" />
        <styled.Image src={image} />
        <div>
          <Text size="m" text={t('messages.signUp_one')} align="left" />
          <styled.Link target="_blank" href={discoverUrl}>
            {appVariables.DISCOVER_URL_DOMAIN}
          </styled.Link>
        </div>

        <Button size="medium" label={t('actions.createOdyssey')} wide onClick={onCreate} />
      </styled.Div>
    </Box>
  );
};

export default CreateOdyssey;
