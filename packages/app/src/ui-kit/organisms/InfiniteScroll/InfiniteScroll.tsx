import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {VariableSizeList, ListChildComponentProps, ListOnItemsRenderedProps} from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

interface PropsInterface {
  itemCount: number;
  items: any[];
  itemData?: any;
  estimatedItemSize: number;
  width: number | string;
  height: number;
  row: FC<ListChildComponentProps<any>>;
  isItemLoaded: (index: number) => boolean;
  loadMore: (startIndex?: number, stopIndex?: number) => void | Promise<void>;
  itemKey?: (index: number) => string;
  handleItemsRendered?: (props: ListOnItemsRenderedProps) => void;
  calcItemSize: (index: number) => number;
}

const InfiniteScroll: FC<PropsInterface> = ({
  itemCount,
  items,
  estimatedItemSize,
  width,
  height,
  itemData,
  row,
  calcItemSize,
  isItemLoaded,
  loadMore,
  handleItemsRendered,
  itemKey
}) => {
  return (
    <InfiniteLoader itemCount={itemCount} isItemLoaded={isItemLoaded} loadMoreItems={loadMore}>
      {({onItemsRendered, ref}) => {
        return (
          <VariableSizeList
            itemCount={itemCount}
            itemKey={(index) => (itemKey ? itemKey(index) : index)}
            onItemsRendered={(props: ListOnItemsRenderedProps) => {
              onItemsRendered(props);
              handleItemsRendered && handleItemsRendered(props);
            }}
            ref={ref}
            estimatedItemSize={estimatedItemSize}
            width={width}
            height={height}
            itemSize={calcItemSize}
            itemData={itemData ? itemData : {items}}
          >
            {row}
          </VariableSizeList>
        );
      }}
    </InfiniteLoader>
  );
};

export default observer(InfiniteScroll);
