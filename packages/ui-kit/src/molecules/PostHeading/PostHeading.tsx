import {FC, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {format} from 'date-fns-tz';
import {PostTypeEnum, useI18n} from '@momentum-xyz/core';

import {IconNameType} from '../../types';
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

  const icon: IconNameType | null = useMemo(() => {
    switch (entry?.type) {
      case PostTypeEnum.VIDEO:
        return 'camera';
      case PostTypeEnum.SCREENSHOT:
        return 'photo_camera';
      default:
        return null;
    }
  }, [entry?.type]);

  return (
    <styled.Header data-testid="PostHeading-test">
      <Hexagon type="fourth-borderless" iconName="astronaut" imageSrc={author.avatarSrc} />
      <styled.UserInfo>
        <styled.UserInfoTitle>
          <styled.UserName>
            {author.name} {author.isItMe && <>({t('labels.you').toUpperCase()})</>}
          </styled.UserName>
          {!!entry && !!entryDate && (
            <styled.World>
              <styled.Icon>
                <IconSvg name={icon || 'alert'} size="xs" isWhite />
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
