import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useForm, SubmitHandler, Controller} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {Heading} from '@momentum/ui-kit';

import {Button, Input, SectionPanel, Text} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {YOUTUBE_URL_PLACEHOLDER} from 'core/constants';
import {BroadcastInterface} from 'api';

import * as styled from './BroadcastFormPanel.styled';

const BroadcastFormPanel: FC = () => {
  const {spaceAdminStore} = useStore();
  const {spaceManagerStore, broadcastStore} = spaceAdminStore;
  const {space} = spaceManagerStore;

  const {t} = useTranslation();

  const {
    control,
    formState: {errors},
    handleSubmit
  } = useForm<BroadcastInterface>();

  const formSubmitHandler: SubmitHandler<BroadcastInterface> = (preview: BroadcastInterface) => {
    broadcastStore.setBroadcastPreview(preview);
  };

  if (!space) {
    return null;
  }

  return (
    <SectionPanel title={t('broadcastAdmin.formTitle')}>
      <styled.Body data-testid="BroadcastFormPanel-test">
        <styled.DescriptionBox>
          <Text text={t('broadcastAdmin.formDescription')} size="m" align="left" isMultiline />
        </styled.DescriptionBox>
        <styled.InstructionBox>
          <Text text={t('broadcastAdmin.formInstruction')} size="m" align="left" />
          <div>
            <Controller
              name="youtubeUrl"
              control={control}
              defaultValue=""
              render={({field: {onChange, value}}) => (
                <Input
                  value={value}
                  onChange={onChange}
                  label={t('broadcastAdmin.formInputLabel')}
                  placeholder={YOUTUBE_URL_PLACEHOLDER}
                  isError={!!errors.youtubeUrl}
                  errorMessage={t('broadcastAdmin.formErrorMessage')}
                />
              )}
              rules={{
                required: true,
                pattern: {
                  value:
                    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/,
                  message: t('broadcastAdmin.formErrorMessage')
                }
              }}
            />
          </div>
          <styled.ButtonWrapper>
            <Button
              label={t('broadcastAdmin.formButton')}
              onClick={handleSubmit(formSubmitHandler)}
              variant="primary"
            />
          </styled.ButtonWrapper>
        </styled.InstructionBox>
        <styled.InfoBox>
          <Text text={t('broadcastAdmin.formInfo')} size="m" align="left" />
          <Heading label={space?.name ?? ''} type="h2" align="left" />
        </styled.InfoBox>
      </styled.Body>
    </SectionPanel>
  );
};

export default observer(BroadcastFormPanel);
