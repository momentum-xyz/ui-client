import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {MediaInterface, PostTypeEnum, useI18n} from '@momentum-xyz/core';

import {PostFormInterface} from '../../interfaces';
import {ButtonEllipse, Frame, Hexagon} from '../../atoms';
import {PostImageForm, PostVideoForm} from '../../molecules';

import {PostTypeSelector} from './components';
import * as styled from './PostCreator.styled';

export interface AuthorInterface {
  id: string;
  name: string;
  avatarSrc: string | undefined;
}

export interface PostCreatorPropsInterface {
  author: AuthorInterface;
  videoOrScreenshot?: MediaInterface | null;
  maxVideoDurationSec: number;
  isCreating?: boolean;
  isScreenRecording?: boolean;
  onMakeScreenshot: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onClearVideoOrScreenshot: () => void;
  onCreatePost: (form: PostFormInterface, postType: PostTypeEnum) => Promise<boolean>;
  onCancel: () => void;
}

const PostCreator: FC<PostCreatorPropsInterface> = ({
  author,
  videoOrScreenshot,
  maxVideoDurationSec,
  isCreating,
  isScreenRecording,
  onMakeScreenshot,
  onStartRecording,
  onStopRecording,
  onClearVideoOrScreenshot,
  onCreatePost,
  onCancel
}) => {
  const [postTypeIntent, setPostTypeIntent] = useState<PostTypeEnum | null>(null);

  const {t} = useI18n();

  const handleCreatePost = async (form: PostFormInterface, postType: PostTypeEnum) => {
    if (await onCreatePost(form, postType)) {
      setPostTypeIntent(null);
    }
  };

  return (
    <styled.Wrapper data-testid="PostCreator-test">
      <Frame>
        <styled.Header>
          <Hexagon type="fourth-borderless" iconName="astronaut" imageSrc={author.avatarSrc} />
          <styled.UserInfo>
            <styled.UserInfoTitle>
              {author.name} ({t('labels.you').toUpperCase()})
            </styled.UserInfoTitle>
          </styled.UserInfo>
        </styled.Header>

        <styled.Content>
          {!postTypeIntent && (
            <>
              <PostTypeSelector onSelect={setPostTypeIntent} />
              <styled.Controls>
                <ButtonEllipse icon="add" label={t('actions.addToTimeline')} disabled />
              </styled.Controls>
            </>
          )}

          {postTypeIntent === PostTypeEnum.SCREENSHOT && (
            <PostImageForm
              screenshot={videoOrScreenshot?.file}
              isPending={isCreating}
              onMakeScreenshot={onMakeScreenshot}
              onClearScreenshot={onClearVideoOrScreenshot}
              onCreateOrUpdate={(form) => handleCreatePost(form, PostTypeEnum.SCREENSHOT)}
              onCancel={() => {
                setPostTypeIntent(null);
                onCancel();
              }}
            />
          )}

          {postTypeIntent === PostTypeEnum.VIDEO && (
            <PostVideoForm
              video={videoOrScreenshot?.file}
              isPending={isCreating}
              isScreenRecording={isScreenRecording}
              maxVideoDurationSec={maxVideoDurationSec}
              onStartRecording={onStartRecording}
              onStopRecording={onStopRecording}
              onClearVideo={onClearVideoOrScreenshot}
              onCreateOrUpdate={(form) => handleCreatePost(form, PostTypeEnum.VIDEO)}
              onCancel={() => {
                setPostTypeIntent(null);
                onCancel();
              }}
            />
          )}

          {postTypeIntent === PostTypeEnum.EVENT && <>TBD</>}
        </styled.Content>
      </Frame>
    </styled.Wrapper>
  );
};

export default observer(PostCreator);
