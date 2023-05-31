import {FC, useCallback, useEffect, useRef} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n, i18n} from '@momentum-xyz/core';
import {TabInterface, Tabs, Panel, NewsfeedEntry} from '@momentum-xyz/ui-kit';

import {useNavigation, useStore} from 'shared/hooks';
import {NewsfeedTabTypeEnum, WidgetEnum} from 'core/enums';

import * as styled from './NewsfeedWidget.styled';

const TABS_LIST: TabInterface<NewsfeedTabTypeEnum>[] = [
  {id: NewsfeedTabTypeEnum.UNIVERSAL, icon: 'clock', label: i18n.t('labels.universal')},
  {id: NewsfeedTabTypeEnum.MY_CONNECTIONS, icon: 'connect', label: i18n.t('labels.myConnections')}
];

const NewsfeedWidget: FC = () => {
  const {widgetManagerStore, widgetStore} = useStore();
  const {close} = widgetManagerStore;
  const {newsfeedStore} = widgetStore;
  const {newsfeedType, currentTabEntries, setActiveNewsfeedType, loadMore} = newsfeedStore;

  const {t} = useI18n();
  const {goToOdysseyHome} = useNavigation();

  const contentRef = useRef(null);
  const observerTargetRef = useRef(null);

  useEffect(() => loadMore(), [loadMore]);

  const handleWorldOpen = useCallback(
    (worldId: string) => {
      console.log('Open newsfeed entry world', worldId);
      if (!worldId) {
        return;
      }
      goToOdysseyHome(worldId);
    },
    [goToOdysseyHome]
  );

  const handleTabChange = (type: NewsfeedTabTypeEnum) => {
    setActiveNewsfeedType(type);
    (contentRef as any).current.scroll({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (d) => {
        if (d[0].isIntersecting) {
          loadMore();
        }
      },
      {threshold: 1}
    );

    if (observerTargetRef.current) {
      observer.observe(observerTargetRef.current);
    }

    return () => {
      if (observerTargetRef.current) {
        observer.unobserve(observerTargetRef.current);
      }
    };
  }, [loadMore, observerTargetRef]);

  return (
    <styled.Container data-testid="NewsfeedWidget-test">
      <Panel
        isFullHeight
        size="normal"
        icon="newsfeed"
        variant="primary"
        title={t('labels.newsfeed')}
        onClose={() => close(WidgetEnum.NEWSFEED)}
      >
        <styled.Wrapper>
          <styled.Tabs>
            <Tabs
              tabList={TABS_LIST}
              activeId={newsfeedType}
              onSelect={(type: NewsfeedTabTypeEnum) => handleTabChange(type)}
            />
          </styled.Tabs>
          <styled.Content ref={contentRef}>
            {currentTabEntries.map((entry) => (
              <NewsfeedEntry
                key={entry.id}
                entry={entry}
                onWorldOpen={handleWorldOpen}
                onShare={() => {}}
              />
            ))}
            <div ref={observerTargetRef}></div>
          </styled.Content>
        </styled.Wrapper>
      </Panel>
    </styled.Container>
  );
};

export default observer(NewsfeedWidget);
