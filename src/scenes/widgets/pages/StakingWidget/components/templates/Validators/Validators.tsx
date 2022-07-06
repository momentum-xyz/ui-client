import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {
  Button,
  IconSvg,
  Loader,
  PropsWithThemeInterface,
  SearchInput,
  Text,
  Toggle,
  Tooltip
} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {ValidatorItemModelInterface} from 'core/models';
import UnityService, {PosBusInteractionType} from 'context/Unity/UnityService';

import {ValidatorList} from './components';
import * as styled from './Validators.styled';

interface PropsInterface extends PropsWithThemeInterface {
  operatorSpaceId?: string;
  goToNominator: () => void;
  goToAuthorization: () => void;
}

const Validators: FC<PropsInterface> = ({
  theme,
  goToAuthorization,
  operatorSpaceId,
  goToNominator
}) => {
  const {widgetStore, favoriteStore} = useStore();
  const {stakingStore} = widgetStore;
  const {validatorsStore} = stakingStore;

  const handleSearch = (value: string) => {
    validatorsStore.setSearch(value);
  };

  const handleIdentityToggle = (checked: boolean) => {
    validatorsStore.setWithIdentity(checked);
    stakingStore.fetchValidators();
  };

  const nextStepHandle = () => {
    if (operatorSpaceId) {
      UnityService.triggerInteractionMsg?.(
        PosBusInteractionType.TriggerStake,
        operatorSpaceId,
        0,
        ''
      );
    }
    goToAuthorization();
  };

  const handleListItemClick = async (eventName: string, item: ValidatorItemModelInterface) => {
    if (eventName === 'selected') {
      item.toggleSelected();
    } else if (eventName === 'bookmark') {
      if (item.isBookmarked) {
        await item.unBookmark(item.id);
      } else {
        await item.bookmark(item.id);
      }
      favoriteStore.fetchFavorites();
      stakingStore.fetchValidators();
    } else if (eventName === 'link') {
      stakingStore.stakingDialog.close();
      UnityService.teleportToSpace(item.operatorId || item.spaceId);
    }
  };

  return (
    <styled.Container theme={theme}>
      <SearchInput
        placeholder={t('staking.validators.searchInputPlaceholder')}
        value={validatorsStore.search}
        onChange={handleSearch}
        delay={300}
      />

      <styled.HeaderContainer>
        <styled.ToggleContainer>
          <Toggle checked={validatorsStore.withIdentity} onChange={handleIdentityToggle} />
          <Text text={t('staking.validators.withIdentity')} size="xs" />
        </styled.ToggleContainer>
        <styled.Legend>
          <Tooltip darkBackground placement="bottom" label={t('staking.stakingTab.selectTooltip')}>
            <styled.LegendItem>
              <IconSvg name="checkmark" size="medium" isCustom />
              {t('staking.validators.legendSelect')}
            </styled.LegendItem>
          </Tooltip>
          <Tooltip
            darkBackground
            placement="bottom"
            label={t('staking.stakingTab.favouriteTooltip')}
          >
            <styled.LegendItem>
              <IconSvg name="starOn" size="medium" isCustom />
              {t('staking.validators.legendBookmark')}
            </styled.LegendItem>
          </Tooltip>
          <Tooltip
            label={
              <styled.SortInfo type="1">
                {t(`staking.stakingTab.sortingInfo.header`)}
                <br /> <br />
                {Array.from({length: 7}, (_, i) => i + 1).map((index) => (
                  <li key={index}>{t(`staking.stakingTab.sortingInfo.points.${index}`)}</li>
                ))}
              </styled.SortInfo>
            }
            placement="bottom"
            darkBackground
            size={{width: '200px'}}
          >
            <styled.LegendItem className="tooltip">
              <IconSvg name="question" size="medium" isCustom />
              {t(`staking.stakingTab.sortingInfo.label`)}
            </styled.LegendItem>
          </Tooltip>
          {/*<styled.LegendItem>*/}
          {/*  <IconSvg name="info" size="medium" isCustom />  {t('staking.validators.legendInfo')}*/}
          {/*</styled.LegendItem>*/}
          <styled.LegendItem>
            <IconSvg name="rocket" size="medium" isCustom />
            {t('staking.validators.legendFlyTo')}
          </styled.LegendItem>
        </styled.Legend>
      </styled.HeaderContainer>
      <styled.ListContainer>
        {validatorsStore.request.isPending ? (
          <div>
            <Loader />
          </div>
        ) : (
          <ValidatorList
            columnHeaders={[
              {
                key: 'isBookmarked',
                icon: 'star',
                sortable: false,
                eventName: 'bookmark',
                isSmall: true
              },
              {
                key: 'operatorSpaceName',
                label: t('staking.validators.columnHeaderOperator'),
                sortable: false,
                truncate: true
              },
              {
                key: 'selected',
                label: '',
                sortable: false,
                eventName: 'selected',
                isSmall: true
              },
              {
                key: 'validator',
                label: t('staking.validators.columnHeaderValidator'),
                sortable: false,
                truncate: true
              },
              {
                key: 'commission',
                label: t('staking.validators.columnHeaderCommission'),
                sortable: false
              },
              {
                key: 'ownStake',
                label: t('staking.validators.columnHeaderOwnStake'),
                sortable: false
              },
              // {key: 'info', sortable: false, eventName: 'info', isSmall: true},
              {key: 'hasLink', sortable: false, eventName: 'link', isSmall: false}
            ]}
            data={validatorsStore.validatorsSearched.slice()}
            onEventClick={(eventName, item) => {
              handleListItemClick(eventName, item);
            }}
          />
        )}
      </styled.ListContainer>

      <styled.ButtonContainer>
        <Button
          variant="primary"
          label={t('actions.back')}
          icon="lightningDuotone"
          wide={false}
          theme={theme}
          onClick={() => goToNominator()}
        />
        <Button
          variant="primary"
          label={t('staking.nominateAndBond')}
          disabled={!validatorsStore.selectedValidatorsValidation}
          icon="lightningDuotone"
          wide={false}
          theme={theme}
          onClick={nextStepHandle}
        />
      </styled.ButtonContainer>
    </styled.Container>
  );
};

export default observer(Validators);
