import {FC, memo} from 'react';

import {TabInterface, Tabs, Panel} from '../../molecules';
import {NewsListItemInterface} from '../../interfaces';

import * as styled from './NewsList.styled';

export interface NewsListPropsInterface {
  title: string;
  items: NewsListItemInterface[];
}

const NewsList: FC<NewsListPropsInterface> = ({title, items}) => {
  const tabList: TabInterface<string>[] = [
    {id: '1', icon: 'clock-two', label: 'Universal'},
    {id: '2', icon: 'hierarchy', label: 'My connections'}
  ];

  return (
    <styled.Container data-testid="NewsList-test">
      <Panel title={title} variant="primary" icon="planet" size="normal">
        <Tabs tabList={tabList} />
      </Panel>
    </styled.Container>
  );
};

export default memo(NewsList);
