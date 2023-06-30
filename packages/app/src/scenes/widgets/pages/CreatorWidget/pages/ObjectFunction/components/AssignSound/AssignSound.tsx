import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useForm} from 'react-hook-form';
import {useI18n} from '@momentum-xyz/core';
import {Button, Frame} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {MusicFileForm} from 'ui-kit';
import {TextObjectInterface} from 'core/interfaces';

import * as styled from './AssignSound.styled';

interface PropsInterface {
  objectId: string;
}

const AssignSound: FC<PropsInterface> = ({objectId}) => {
  const {universeStore} = useStore();
  const {worldId} = universeStore;

  const [isNewForm, setIsNewForm] = useState(false);

  const {t} = useI18n();

  const {
    control,
    handleSubmit,
    formState: {errors}
  } = useForm<TextObjectInterface>({});

  console.log(worldId, control, errors, t, handleSubmit);

  return (
    <styled.Container data-testid="AssignSound-test">
      <Frame>
        <styled.Head>
          <styled.Title>{t('titles.objectSound')}</styled.Title>
          <styled.Message>{t('messages.objectSound')}</styled.Message>

          <styled.UploadBlock>
            {!isNewForm ? (
              <Button
                wide
                icon="sound_add"
                label={t('actions.uploadSoundFile')}
                onClick={() => setIsNewForm(true)}
              />
            ) : (
              <MusicFileForm
                isPending={false}
                //isPending={musicManagerStore.isUpdating}
                onCancel={() => setIsNewForm(false)}
                //onPublish={handlePublish}
                onPublish={() => {}}
              />
            )}
          </styled.UploadBlock>
        </styled.Head>
      </Frame>
    </styled.Container>
  );
};

export default observer(AssignSound);
