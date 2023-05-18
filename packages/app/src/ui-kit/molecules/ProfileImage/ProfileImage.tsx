import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Image, ImageSizeEnum, Frame, IconNameType} from '@momentum-xyz/ui-kit';

import {getImageAbsoluteUrl} from 'core/utils';

import * as styled from './ProfileImage.styled';

interface PropsInterface {
  name?: string;
  image?: string | null;
  imageHeight?: number;
  imageErrorIcon: IconNameType;
  byName?: string;
  onByClick?: () => void;
}

const ProfileImage: FC<PropsInterface> = (props) => {
  const {name, image, imageErrorIcon, byName, imageHeight = 200, onByClick} = props;

  const {t} = useI18n();

  return (
    <styled.Container data-testid="ProfileImage-test">
      <Frame>
        <styled.Wrapper>
          <Image
            src={getImageAbsoluteUrl(image, ImageSizeEnum.S6)}
            errorIcon={imageErrorIcon}
            height={imageHeight}
          />
          {name && (
            <div>
              <styled.Name>{name}</styled.Name>
              {byName && (
                <div>
                  <span>{`${t('labels.by')}: `}</span>
                  <styled.Link onClick={onByClick}>{byName}</styled.Link>
                </div>
              )}
            </div>
          )}
        </styled.Wrapper>
      </Frame>
    </styled.Container>
  );
};

export default observer(ProfileImage);
