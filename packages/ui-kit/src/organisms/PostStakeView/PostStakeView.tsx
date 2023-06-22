import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';

import {PostHeading} from '../../molecules';
import {Frame, Hexagon} from '../../atoms';
import {PostAuthorInterface, PostEntryInterface} from '../../interfaces';

import * as styled from './PostStakeView.styled';

export interface PostStakeViewPropsInterface {
  author: PostAuthorInterface;
  entry: PostEntryInterface;
  onVisit?: () => void;
}

const PostStakeView: FC<PostStakeViewPropsInterface> = ({author, entry, onVisit}) => {
  const {t} = useI18n();

  return (
    <styled.Container data-testid="PostStakeView-test">
      <Frame>
        {/* HEADER */}
        <PostHeading author={author} entry={entry} />

        <styled.Wrapper>
          <styled.Grid>
            <Hexagon
              type="fourth-borderless"
              imageSrc={entry.objectAvatarSrc}
              iconName="rabbit_fill"
            />
            <div>
              <styled.WorldName onClick={onVisit}>{entry.objectName}</styled.WorldName>{' '}
              {t('messages.receivedBoost', {
                amount: entry.tokenAmount,
                symbol: entry.tokenSymbol,
                name: author.name
              })}
            </div>
          </styled.Grid>
        </styled.Wrapper>
      </Frame>
    </styled.Container>
  );
};

export default observer(PostStakeView);
