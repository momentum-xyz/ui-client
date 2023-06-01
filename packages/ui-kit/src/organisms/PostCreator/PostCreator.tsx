import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {MediaInterface, PostTypeEnum, useI18n} from '@momentum-xyz/core';

import {PostFormInterface} from '../../interfaces';
import {ButtonEllipse, Frame, Hexagon} from '../../atoms';

import {ImagePostForm, PostTypeSelector} from './components';
import * as styled from './PostCreator.styled';

export interface AuthorInterface {
  id: string;
  name: string;
  avatarSrc: string | undefined;
}

export interface PostCreatorPropsInterface {
  author: AuthorInterface;
  videoOrScreenshot?: MediaInterface;
  isCreating?: boolean;
  onMakeScreenshot: () => void;
  onCreatePost: (form: PostFormInterface, postType: PostTypeEnum) => void;
  onCancel: () => void;
}

const PostCreator: FC<PostCreatorPropsInterface> = ({
  author,
  videoOrScreenshot,
  isCreating,
  onMakeScreenshot,
  onCreatePost,
  onCancel
}) => {
  const [postTypeIntent, setPostTypeIntent] = useState<PostTypeEnum | null>(null);

  const {t} = useI18n();

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

          {postTypeIntent === PostTypeEnum.IMAGE && (
            <ImagePostForm
              screenshot={videoOrScreenshot?.file}
              isCreating={isCreating}
              onMakeScreenshot={onMakeScreenshot}
              onCreatePost={(form) => onCreatePost(form, PostTypeEnum.IMAGE)}
              onCancel={() => {
                setPostTypeIntent(null);
                onCancel();
              }}
            />
          )}

          {postTypeIntent === PostTypeEnum.VIDEO && <></>}

          {postTypeIntent === PostTypeEnum.EVENT && <>TBD</>}
        </styled.Content>
      </Frame>
    </styled.Wrapper>
  );
};

export default observer(PostCreator);
