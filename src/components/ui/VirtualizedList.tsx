
import React, { useMemo } from 'react';
import { FixedSizeList as List, areEqual } from 'react-window';
import { Skeleton } from '@/components/ui/skeleton';

interface VirtualizedListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  loading?: boolean;
  onScroll?: (props: any) => void;
  loadMore?: () => void;
  hasNextPage?: boolean;
}

const ItemWrapper = React.memo<{
  index: number;
  style: React.CSSProperties;
  data: {
    items: any[];
    renderItem: (item: any, index: number) => React.ReactNode;
  };
}>(({ index, style, data }) => {
  const { items, renderItem } = data;
  const item = items[index];

  return (
    <div style={style}>
      {item ? renderItem(item, index) : (
        <div className="p-4">
          <Skeleton className="h-20 w-full" />
        </div>
      )}
    </div>
  );
}, areEqual);

ItemWrapper.displayName = 'ItemWrapper';

function VirtualizedList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  className = '',
  loading = false,
  onScroll,
  loadMore,
  hasNextPage = false
}: VirtualizedListProps<T>) {
  const itemData = useMemo(() => ({
    items,
    renderItem,
  }), [items, renderItem]);

  const handleScroll = (props: any) => {
    onScroll?.(props);
    
    // Load more when near bottom
    if (loadMore && hasNextPage) {
      const { scrollTop, scrollHeight, clientHeight } = props;
      const threshold = 0.8; // Load when 80% scrolled
      
      if (scrollTop + clientHeight >= scrollHeight * threshold) {
        loadMore();
      }
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      <List
        height={height}
        itemCount={items.length}
        itemSize={itemHeight}
        itemData={itemData}
        onScroll={handleScroll}
        overscanCount={5}
      >
        {ItemWrapper}
      </List>
    </div>
  );
}

export default VirtualizedList;
