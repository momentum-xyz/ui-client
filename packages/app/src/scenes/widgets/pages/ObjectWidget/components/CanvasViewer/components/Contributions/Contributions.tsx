import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Button, Input, Select, SelectOptionInterface, stringInputMask} from '@momentum-xyz/ui-kit';

import * as styled from './Contributions.styled';

interface PropsInterface {
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

const Contributions: FC<PropsInterface> = ({onContribute}) => {
  const [query, setQuery] = useState<string>('');
  const [sortType, setSortType] = useState<SortType | null>(null);

  const {t} = useI18n();

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
    </styled.Container>
  );
};

export default observer(Contributions);
