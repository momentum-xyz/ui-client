import {useClickOutside} from '@momentum-xyz/ui-kit';
import {Dropdown, Heading, PanelLayout, Text} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {FC, useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {generatePath, useHistory, useParams} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';

import * as styled from './ObjectFunctionalityPage.styled';

const ObjectFunctionalityPage: FC = () => {
  const {odysseyCreatorStore, unityStore} = useStore();
  const {objectFunctionalityStore} = odysseyCreatorStore;

  const ref = useRef<HTMLDivElement>(null);
  const {objectId} = useParams<{objectId: string}>();

  const history = useHistory();
  const {t} = useTranslation();

  useClickOutside(ref, () => {
    history.push(generatePath(ROUTES.odyssey.creator.base, {worldId: unityStore.worldId}));
  });

  useEffect(() => {
    objectFunctionalityStore.fetchObject(objectId);
  }, [objectId, objectFunctionalityStore]);

  return (
    <styled.Wrapper>
      <styled.Container ref={ref}>
        <PanelLayout
          title={t('titles.selectFunctionality')}
          headerIconName="blocks"
          headerType="h2"
          iconSize="medium"
        >
          <styled.PanelBody>
            <styled.HeadingWrapper>
              <Heading
                label={t('labels.selectFunction')}
                type="h2"
                align="left"
                transform="uppercase"
              />
              <Text text={t('messages.selectOne')} size="s" align="left" />
            </styled.HeadingWrapper>
            <Dropdown
              value={objectFunctionalityStore.currentAssetId}
              options={Object.entries(objectFunctionalityStore.assets2D).map(([key, value]) => ({
                label: value,
                value: key
              }))}
              placeholder={t('placeholders.selectAnOption')}
              onOptionSelect={async (option) => {
                objectFunctionalityStore.selectAsset(option.value);
                await objectFunctionalityStore.updateObject();
              }}
              variant="secondary"
            />
          </styled.PanelBody>
        </PanelLayout>
      </styled.Container>
    </styled.Wrapper>
  );
};

export default observer(ObjectFunctionalityPage);
