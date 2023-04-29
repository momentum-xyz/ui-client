import {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Hexagon, IconSvg, ButtonEllipse} from '@momentum-xyz/ui-kit-storybook';

import {WorldStakerModelInterface} from 'core/models';

import * as styled from './StakersList.styled';

const USERS_MAX = 2;

interface PropsInterface {
  stakers?: WorldStakerModelInterface[] | null;
  onSelectUser?: (userId: string) => void;
}

const StakersList: FC<PropsInterface> = ({stakers, onSelectUser}) => {
  const [isButtonShown, setIsButtonShown] = useState(false);

  const {t} = useI18n();

  useEffect(() => {
    const stakersCount = stakers?.length || 0;
    setIsButtonShown(stakersCount > USERS_MAX);
  }, [stakers?.length]);

  return (
    <>
      {stakers && (stakers?.length || 0) > 0 && (
        <styled.Container data-testid="StakersList-test">
          <styled.Title>
            <IconSvg name="connect" size="xs" isWhite />
            <span>{t('labels.connections')}</span>
          </styled.Title>

          {(isButtonShown ? stakers.slice(0, USERS_MAX) : stakers).map((user, index) => {
            const username = user.name || user.user_id;
            return (
              <styled.StakedInUser key={user.user_id} onClick={() => onSelectUser?.(user.user_id)}>
                <Hexagon type="fourth-borderless" skipOuterBorder imageSrc={user.avatarHash} />
                <styled.Link>
                  {index < USERS_MAX ? `${t('labels.topConnector')}: ${username}` : username}
                </styled.Link>
              </styled.StakedInUser>
            );
          })}

          {isButtonShown && (
            <styled.ShowAllButtonContainer>
              <ButtonEllipse label={t('actions.seeAll')} onClick={() => setIsButtonShown(false)} />
            </styled.ShowAllButtonContainer>
          )}
        </styled.Container>
      )}
    </>
  );
};

export default observer(StakersList);
