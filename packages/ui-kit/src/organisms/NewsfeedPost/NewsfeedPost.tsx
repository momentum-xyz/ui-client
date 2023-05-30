import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n, NewsfeedTypeEnum} from '@momentum-xyz/core';

import {ButtonEllipse, Frame, Hexagon, IconSvg} from '../../atoms';

import * as styled from './NewsfeedPost.styled';

enum NewsfeedPostTypeEnum {
  IMAGE = NewsfeedTypeEnum.IMAGE,
  VIDEO = NewsfeedTypeEnum.VIDEO,
  EVENT = NewsfeedTypeEnum.EVENT
}

export interface AuthorInterface {
  id: string;
  name: string;
  avatarSrc: string | undefined;
}

export interface NewsfeedPostPropsInterface {
  author: AuthorInterface;
  canPostEvents?: boolean;
}

const NewsfeedPost: FC<NewsfeedPostPropsInterface> = ({author, canPostEvents}) => {
  const {t} = useI18n();
  console.log(t);

  const [postTypeIntent, setPostTypeIntent] = useState<NewsfeedPostTypeEnum | null>(null);
  const [postType, setPostType] = useState<NewsfeedPostTypeEnum | null>(null);

  return (
    <styled.Wrapper data-testid="NewsfeedPost-test">
      <Frame>
        <styled.Header>
          <Hexagon
            key={`${author.id}-author-avatar`}
            type="fourth-borderless"
            imageSrc={author.avatarSrc}
          />
          <styled.UserInfo className="user-info-container">
            <styled.UserInfoTitle>{author.name} (YOU)</styled.UserInfoTitle>
          </styled.UserInfo>
        </styled.Header>
        <styled.Content>
          {!postType && (
            <styled.PostTypeSelection>
              <styled.PostTypeSelectionInfo>
                Create a snapshot or a video and share this to all visitors of Odyssey
              </styled.PostTypeSelectionInfo>
              <styled.PostTypeSelectionTypes>
                <styled.PostTypeSelectionTypeButton
                  onClick={() => setPostTypeIntent(NewsfeedPostTypeEnum.IMAGE)}
                >
                  <IconSvg size="xll" isWhite name="photo_camera" />
                  <span>Take a snapshot</span>
                </styled.PostTypeSelectionTypeButton>
                <styled.PostTypeSelectionTypeButton
                  onClick={() => setPostTypeIntent(NewsfeedPostTypeEnum.VIDEO)}
                >
                  {/* TODO: fix this icon */}
                  <IconSvg size="xll" isWhite name="cameraOn" />
                  <span>Create a video</span>
                </styled.PostTypeSelectionTypeButton>

                {canPostEvents && (
                  <styled.PostTypeSelectionTypeButton
                    onClick={() => setPostTypeIntent(NewsfeedPostTypeEnum.EVENT)}
                  >
                    <IconSvg size="xll" isWhite name="calendar" />
                    <span>Create an event</span>
                  </styled.PostTypeSelectionTypeButton>
                )}
              </styled.PostTypeSelectionTypes>
              <styled.PostTypeSelectionControls>
                <ButtonEllipse
                  label="Add to timeline"
                  icon="add"
                  disabled={!postTypeIntent}
                  onClick={() => setPostType(postTypeIntent)}
                />
              </styled.PostTypeSelectionControls>
            </styled.PostTypeSelection>
          )}
          {postType && <></>}
        </styled.Content>
      </Frame>
    </styled.Wrapper>
  );
};

export default observer(NewsfeedPost);
