import {FC, memo} from 'react';

import {Hexagon} from '../../atoms';
import {FrameTabInterface, FrameTabs, Panel} from '../../molecules';
import {NewsListItemInterface} from '../../interfaces';

import * as styled from './NewsList.styled';

export interface NewsListPropsInterface {
  title: string;
  items: NewsListItemInterface[];
}

const NewsList: FC<NewsListPropsInterface> = ({title, items}) => {
  const tabList: FrameTabInterface[] = [
    {id: '1', icon: 'clock-two', label: 'Universal'},
    {id: '2', icon: 'hierarchy', label: 'My connections'}
  ];

  return (
    <styled.Container data-testid="NewsList-test">
      <Panel
        title={title}
        variant="primary"
        hexagon={<Hexagon type="secondary-borderless" iconName="planet" />}
      >
        <FrameTabs tabList={tabList} />
      </Panel>
    </styled.Container>
  );
};

export default memo(NewsList);
