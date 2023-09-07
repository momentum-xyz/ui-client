import {FC, useMemo, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {dateWithoutTime, getTime, useI18n} from '@momentum-xyz/core';
import {
  Image,
  Input,
  Select,
  Button,
  TextCut,
  ButtonEllipse,
  stringInputMask,
  SelectOptionInterface
} from '@momentum-xyz/ui-kit';

import {ContributionItemInterface} from 'api';
import {getImageAbsoluteUrl} from 'core/utils';

import * as styled from './Contributions.styled';

interface PropsInterface {
  contributions: ContributionItemInterface[];
  onFlyToObject: (objectId: string) => void;
  onContribute: () => void;
}

type SortType = 'title' | 'mostLiked';

const SORT_OPTIONS: SelectOptionInterface<SortType>[] = [
  {
    label: 'By Title',
    value: 'title'
  },
  {
    label: 'Most Liked',
    value: 'mostLiked'
  }
];

const Contributions: FC<PropsInterface> = ({contributions, onFlyToObject, onContribute}) => {
  const [query, setQuery] = useState<string>('');
  const [sortType, setSortType] = useState<SortType | null>(null);

  const {t} = useI18n();

  const sortedFilteredContributions = useMemo(() => {
    const filteredItems = query
      ? contributions.filter((i) => i.value.answerOne.toLowerCase().includes(query.toLowerCase()))
      : contributions;

    switch (sortType) {
      case 'title':
        return [...filteredItems].sort((a, b) => {
          return a.value.answerOne.localeCompare(b.value.answerOne);
        });
      case 'mostLiked':
        return [...filteredItems].sort((a, b) => {
          return b.votes - a.votes;
        });
      default:
        return filteredItems;
    }
  }, [contributions, query, sortType]);

  console.log('sortedFilteredContributions', sortedFilteredContributions);

  return (
    <styled.Container data-testid="Contributions-test">
      <styled.Search>
        <Input
          wide
          isSearch
          isClearable
          value={query}
          opts={stringInputMask}
          placeholder={t('actions.searchContributions')}
          onChange={setQuery}
        />

        <styled.Sorting>
          <Select
            wide
            isClearable
            value={sortType}
            isDisabled={false}
            options={SORT_OPTIONS}
            placeholder={t('placeholders.sort')}
            onSingleChange={setSortType}
          />

          <Button
            wide
            icon="person_idea"
            variant="secondary"
            label={t('labels.contribute')}
            onClick={onContribute}
          />
        </styled.Sorting>
      </styled.Search>

      <styled.ContributionCount>
        {t('labels.contributionCount', {count: sortedFilteredContributions.length})}
      </styled.ContributionCount>

      <styled.ContributionList>
        {sortedFilteredContributions.map((i) => (
          <styled.Contribution key={i.object_id}>
            <styled.ContributionInner>
              <Image
                height={80}
                errorIcon="rabbit_fill"
                src={getImageAbsoluteUrl(i.value.render_hash)}
              />
              <div>
                <styled.ContributionTitle>{i.value.answerOne}</styled.ContributionTitle>
                <styled.Date>
                  {dateWithoutTime(i.created_at)} / {getTime(i.created_at)}
                </styled.Date>

                <styled.Description>
                  <TextCut text={i.value.answerTwo} lines={2} />
                </styled.Description>

                <styled.Actions>
                  <ButtonEllipse
                    isLabel
                    icon="heart"
                    variant="secondary"
                    label={i.votes.toString()}
                  />
                  <ButtonEllipse
                    isLabel
                    icon="comment"
                    variant="secondary"
                    label={t('labels.commentsCount', {count: i.comments})}
                  />
                  <ButtonEllipse
                    icon="rocket_flying"
                    variant="secondary"
                    label={t('actions.visit')}
                    onClick={() => onFlyToObject(i.object_id)}
                  />
                </styled.Actions>
              </div>
            </styled.ContributionInner>
          </styled.Contribution>
        ))}
      </styled.ContributionList>
    </styled.Container>
  );
};

export default observer(Contributions);
