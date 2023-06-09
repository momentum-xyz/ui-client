import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {format} from 'date-fns-tz';
import {useI18n} from '@momentum-xyz/core';

import {Hexagon, IconSvg} from '../../atoms';
import {PostAuthorInterface, PostEntryInterface} from '../../interfaces';

import * as styled from './PostHeading.styled';

export interface PostHeadingPropsInterface {
  entry?: PostEntryInterface;
  author: PostAuthorInterface;
}

const PostHeading: FC<PostHeadingPropsInterface> = ({entry, author}) => {
  const {t} = useI18n();

  const entryDate = entry ? new Date(entry.created) : null;

  return (
    <styled.Header data-testid="PostHeading-test">
      <Hexagon type="fourth-borderless" iconName="astronaut" imageSrc={author.avatarSrc} />
      <styled.UserInfo>
        <styled.UserInfoTitle>
          <div>
            {author.name} {author.isItMe && <>({t('labels.you').toUpperCase()})</>}
          </div>
          {!!entry && !!entryDate && (
            <styled.World>
              <styled.Icon>
                <IconSvg name={entry.icon} size="xs" isWhite />
              </styled.Icon>

              {entry.objectId && (
                <>
                  <styled.WorldName>{entry.objectName || entry.objectId}</styled.WorldName>
                  <div>/</div>
                </>
              )}

              <div>{format(entryDate, 'yyyy-MM-dd')}</div>
              <div>/</div>
              <div>{format(entryDate, 'HH aa')}</div>
            </styled.World>
          )}
        </styled.UserInfoTitle>
      </styled.UserInfo>
    </styled.Header>
  );
};

export default observer(PostHeading);
