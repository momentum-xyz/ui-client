import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {format} from 'date-fns-tz';
import {Heading, Button, IconSvg, Text} from '@momentum-xyz/ui-kit';

import {OdysseyFeedInterface} from 'scenes/birthOfMe/stores/ExploreStore';

import * as styled from './NewsFeed.styled';

interface PropsInterface {
  newsFeed: OdysseyFeedInterface[];
  onTeleport: (id: string) => void;
  onConnect: (id: string) => void;
}

const NewsFeed: FC<PropsInterface> = (props) => {
  const {newsFeed, onTeleport, onConnect} = props;

  return (
    <styled.Container data-testid="NewsFeed-test">
      <styled.Explore>
        <IconSvg name="solar-system" size="medium" />
        <Heading type="h2" label="Newsfeed" weight="normal" />
      </styled.Explore>

      <styled.Feed>
        {!!newsFeed.length && (
          <>
            {newsFeed.map((item) => {
              const formattedDate = format(new Date(item.date), `MM/dd/yyyy - h:mm aa`);
              let message = '';
              switch (item.type) {
                case 'created': {
                  message = `${item.name} was created`;
                  break;
                }
                case 'connected': {
                  message = `${item.name} and ${item.connectedTo?.name} connected`;
                  break;
                }
                case 'docked': {
                  message = `${item.name} docked in ${item.dockedTo?.name}`;
                  break;
                }
              }

              return (
                <styled.FeedItem key={item.id}>
                  <div>
                    {item.type !== 'connected' ? (
                      <styled.OneAvatar src={item.image} />
                    ) : (
                      <>
                        <styled.TwoAvatarsContainer>
                          <styled.Avatar src={item.image} />
                          <styled.AvatarAhead src={item.connectedTo?.image} />
                        </styled.TwoAvatarsContainer>
                      </>
                    )}
                  </div>
                  <styled.Info>
                    <styled.Date>{formattedDate}</styled.Date>
                    <div>
                      <Text size="xxs" text={message} align="left" />
                    </div>
                    {item.type === 'created' && (
                      <styled.Actions>
                        <Button
                          size="small"
                          label="Connect"
                          icon="hierarchy"
                          onClick={() => onConnect(item.id.toString())}
                        />
                        <Button
                          size="small"
                          label=""
                          icon="fly-to"
                          onClick={() => onTeleport(item.id.toString())}
                        />
                      </styled.Actions>
                    )}
                  </styled.Info>
                </styled.FeedItem>
              );
            })}
          </>
        )}
      </styled.Feed>
    </styled.Container>
  );
};

export default observer(NewsFeed);
