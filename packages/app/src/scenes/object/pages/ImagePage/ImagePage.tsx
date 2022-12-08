import React, {FC} from 'react';
import {SvgButton, Text} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {generatePath, useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {ObjectInterface} from 'api';

import * as styled from './ImagePage.styled';

interface PropsInterface {
  imageSrc?: string;
  content?: ObjectInterface;
  worldId: string;
}

const ImagePage: FC<PropsInterface> = ({imageSrc, content, worldId}) => {
  const history = useHistory();

  if (!imageSrc) {
    return null;
  }

  return (
    <styled.Modal data-testid="ImagePage-test">
      <styled.Container>
        <styled.ContentWrapper>
          {imageSrc && <styled.ImageWrapper src={imageSrc} alt="" />}
        </styled.ContentWrapper>
        <styled.HeaderElement className="left">
          <styled.Title>
            <Text
              text={content?.title ? content?.title : 'Image'}
              transform="uppercase"
              weight="bold"
              size="xl"
            />
          </styled.Title>
        </styled.HeaderElement>
        <styled.HeaderElement className="right">
          <styled.Button>
            <SvgButton
              iconName="close"
              size="large"
              isWhite
              onClick={() => {
                history.push(generatePath(ROUTES.odyssey.base, {worldId}));
              }}
            />
          </styled.Button>
        </styled.HeaderElement>
      </styled.Container>
    </styled.Modal>
  );
};

export default observer(ImagePage);
