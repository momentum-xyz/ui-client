import {Dropdown, Heading, PanelLayout, Text} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {FC, useEffect, useRef} from 'react';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';

import * as styled from './ObjectFunctionalityPage.styled';

const ObjectFunctionalityPage: FC = () => {
  const {odysseyCreatorStore} = useStore();
  const {objectFunctionalityStore, selectedObjectId} = odysseyCreatorStore;

  const ref = useRef<HTMLDivElement>(null);

  const {t} = useI18n();

  // TODO remove this and simplify the store
  useEffect(() => {
    if (selectedObjectId) {
      objectFunctionalityStore.init(selectedObjectId);
    }

    return () => {
      objectFunctionalityStore.resetModel();
    };
  }, [selectedObjectId, objectFunctionalityStore]);

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
              options={objectFunctionalityStore.asset2dOptions}
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
