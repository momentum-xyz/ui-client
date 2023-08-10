import {FC, useRef} from 'react';
import {observer} from 'mobx-react-lite';
import {VariableSizeList} from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import AutoSizer, {Size} from 'react-virtualized-auto-sizer';
import {Loader} from '@momentum-xyz/ui-kit';

import {SkyboxGroupRow} from 'ui-kit';
import {SkyboxItemModelType} from 'core/models';

import * as styled from './SkyboxList.styled';

interface PropsInterface {
  isLoading: boolean;
  isMySkyboxes: boolean;
  skyboxGroups: SkyboxItemModelType[][];
  skyboxGroupCount: number;
  onSkyboxSelect: (skybox: SkyboxItemModelType) => void;
  onSkyboxDelete: (skyboxId: string) => void;
  onLoadMore: (startIndex: number) => void;
}

const SkyboxList: FC<PropsInterface> = ({
  skyboxGroups,
  isLoading,
  isMySkyboxes,
  skyboxGroupCount,
  onSkyboxSelect,
  onSkyboxDelete,
  onLoadMore
}) => {
  const infiniteRef = useRef(null);
  const scrollListRef = useRef<VariableSizeList | null>();

  return (
    <styled.Container data-testid="SkyboxList-test">
      <AutoSizer>
        {({height, width}: Size) => {
          return (
            <div>
              <InfiniteLoader
                threshold={2}
                ref={infiniteRef}
                itemCount={skyboxGroupCount}
                isItemLoaded={(index) => index < skyboxGroups.length}
                loadMoreItems={(startIndex) => {
                  onLoadMore(startIndex);
                }}
              >
                {({onItemsRendered, ref}) => {
                  return (
                    <VariableSizeList
                      width={width}
                      height={height}
                      ref={(list) => {
                        ref(list);
                        scrollListRef.current = list;
                      }}
                      itemSize={() => 192}
                      itemCount={skyboxGroupCount}
                      itemKey={(index) => index}
                      itemData={{
                        items: skyboxGroups,
                        isMySkyboxes,
                        onSkyboxDelete,
                        onSkyboxSelect
                      }}
                      onItemsRendered={onItemsRendered}
                      estimatedItemSize={192}
                    >
                      {SkyboxGroupRow}
                    </VariableSizeList>
                  );
                }}
              </InfiniteLoader>
            </div>
          );
        }}
      </AutoSizer>

      {isLoading && skyboxGroups.length === 0 && (
        <styled.SkyboxLoader>
          <Loader />
        </styled.SkyboxLoader>
      )}
    </styled.Container>
  );
};

export default observer(SkyboxList);
