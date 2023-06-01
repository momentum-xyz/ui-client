import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {PostTypeEnum, useI18n} from '@momentum-xyz/core';

import {ButtonEllipse, Frame, Hexagon} from '../../atoms';

import {PostTypeSelector} from './components';
import * as styled from './PostCreator.styled';

export interface AuthorInterface {
  id: string;
  name: string;
  avatarSrc: string | undefined;
}

export interface PostCreatorPropsInterface {
  author: AuthorInterface;
  onPublish: () => void;
}

const PostCreator: FC<PostCreatorPropsInterface> = ({author, onPublish}) => {
  const {t} = useI18n();

  const [postTypeIntent, setPostTypeIntent] = useState<PostTypeEnum | null>(null);

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
          {!postTypeIntent && <PostTypeSelector onSelect={setPostTypeIntent} />}

          {postTypeIntent === PostTypeEnum.IMAGE && <></>}

          {postTypeIntent === PostTypeEnum.VIDEO && <></>}

          {postTypeIntent === PostTypeEnum.EVENT && <></>}

          <styled.Controls>
            <ButtonEllipse
              icon="add"
              label={t('actions.addToTimeline')}
              disabled={!postTypeIntent}
              onClick={() => {
                onPublish();
                setPostTypeIntent(null);
              }}
            />
          </styled.Controls>
        </styled.Content>
      </Frame>
    </styled.Wrapper>
  );
};

export default observer(PostCreator);
