import {FC, memo} from 'react';
import {
  TwitterShareButton,
  TelegramShareButton,
  LinkedinShareButton,
  InstapaperShareButton
} from 'react-share';
import {copyToClipboard, useI18n} from '@momentum-xyz/core';

import {ButtonRound, IconButton} from '../../atoms';

import * as styled from './PostSharing.styled';

export interface PostSharingPropsInterface {
  title: string;
  targetUrl: string;
  onClose: () => void;
}

const PostSharing: FC<PostSharingPropsInterface> = ({title, targetUrl, onClose}) => {
  const {t} = useI18n();

  return (
    <styled.Container data-testid="PostSharing-test">
      <styled.Header>
        <div>{t('messages.shareThisPost')}</div>
        <IconButton name="close_large" isWhite />
      </styled.Header>

      <styled.Content>
        <TwitterShareButton title={title} url={targetUrl}>
          <ButtonRound size="extra-large" icon="twitter" />
        </TwitterShareButton>
        <TelegramShareButton title={title} url={targetUrl}>
          <ButtonRound size="extra-large" icon="telegram" />
        </TelegramShareButton>
        <LinkedinShareButton title={title} url={targetUrl}>
          <ButtonRound size="extra-large" icon="linkedin" />
        </LinkedinShareButton>
        <InstapaperShareButton title={title} url={targetUrl}>
          <ButtonRound size="extra-large" icon="instagram" />
        </InstapaperShareButton>
      </styled.Content>

      <styled.Copy>
        <styled.Url>{targetUrl}</styled.Url>
        <ButtonRound size="extra-large" icon="copy" onClick={() => copyToClipboard(targetUrl)} />
      </styled.Copy>
    </styled.Container>
  );
};

export default memo(PostSharing);
