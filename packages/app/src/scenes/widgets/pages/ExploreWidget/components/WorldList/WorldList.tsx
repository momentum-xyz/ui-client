import {FC} from 'react';

import {NftItemModelInterface} from 'core/models';

import * as styled from './WorldList.styled';

interface PropsInterface {
  lastCreatedItems: NftItemModelInterface[];
  lastUpdatedItems: NftItemModelInterface[];
  mostFeaturedItems: NftItemModelInterface[];
  mostStakedInItems: NftItemModelInterface[];
}

const WorldList: FC<PropsInterface> = ({
  lastCreatedItems,
  lastUpdatedItems,
  mostFeaturedItems,
  mostStakedInItems
}) => {
  return (
    <styled.Wrapper data-testid="WorldList-test">
      <div>{mostFeaturedItems.length}</div>
      <div>{lastCreatedItems.length}</div>
      <div>{lastUpdatedItems.length}</div>
      <div>{mostStakedInItems.length}</div>
    </styled.Wrapper>
  );
};

export default WorldList;
