import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useForm, SubmitHandler, Controller} from 'react-hook-form';

import {Button, Heading, Input, SectionPanel, Text} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {YOUTUBE_URL_PLACEHOLDER} from 'core/constants';
import {BroadcastInterface} from 'api';

import * as styled from './BroadcastFormPanel.styled';
// TODO translation
const BroadcastFormPanel: FC = () => {
  const {spaceAdminStore} = useStore();
  const {spaceManagerStore, broadcastStore} = spaceAdminStore;
  const {space} = spaceManagerStore;

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
    <SectionPanel title="Broadcast" isCustom>
      <styled.Body data-testid="BroadcastFormPanel-test">
        <styled.DescriptionBox>
          <Text
            text="Broadcasting allows you to send out a message to this space and the spaces below. Add a youtube url to start broadcasting. What would you like to broadcast?"
            size="m"
            align="left"
            isMultiline
          />
        </styled.DescriptionBox>
        <styled.InstructionBox>
          <Text text="Add a youtube url which you would like to broadcast:" size="m" align="left" />
          <div>
            <Controller
              name="youtubeUrl"
              control={control}
              defaultValue=""
              render={({field: {onChange, value}}) => (
                <Input
                  value={value}
                  onChange={onChange}
                  label="youtube video url"
                  placeholder={YOUTUBE_URL_PLACEHOLDER}
                  isError={!!errors.youtubeUrl || !broadcastStore.previewHash}
                  errorMessage="Please enter a valid Youtube URL"
                />
              )}
              rules={{
                required: true,
                pattern: {
                  value:
                    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/,
                  message: 'Please enter a valid Youtube URL'
                }
              }}
            />
          </div>
          <styled.ButtonWrapper>
            <Button label="preview" onClick={handleSubmit(formSubmitHandler)} variant="primary" />
          </styled.ButtonWrapper>
        </styled.InstructionBox>
        <styled.InfoBox>
          <Text
            text="The broadcast will be sent to the following spaces and their subspaces:"
            size="m"
            align="left"
          />
          <Heading label={space?.name ?? ''} type="h2" align="left" />
        </styled.InfoBox>
      </styled.Body>
    </SectionPanel>
  );
};

export default observer(BroadcastFormPanel);
