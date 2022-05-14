import React from 'react';

import {useGetSpace} from '../../../hooks/api/useSpaceService';
import {bytesToUuid} from '../../../core/utils/uuid.utils';
import {Space} from '../../../context/type/Space';
import SocialSpaceItem from '../../atoms/socialui/SocialSpaceItem';
import {SocialSearchMinimalCharacters} from '../../atoms/socialui/SocialSearch';

interface SocialSpacesListProps {
  spaceId: Buffer;
  onSpaceSelect: (Buffer) => void;
  searchQuery?: string;
  searchedSpaces?: Space[];
}

const SocialSpacesList: React.FC<SocialSpacesListProps> = ({
  spaceId,
  onSpaceSelect,
  searchQuery,
  searchedSpaces
}) => {
  const [spaceResponse] = useGetSpace(bytesToUuid(spaceId));

  const renderList = () => {
    if (!spaceResponse?.space.children) return;

    const sorter = (a, b) => a.name.localeCompare(b.name);

    if (searchQuery && searchQuery.length >= SocialSearchMinimalCharacters) {
      return searchedSpaces
        ?.sort(sorter)
        .map((space) => (
          <SocialSpaceItem
            space={space}
            onSelect={onSpaceSelect}
            key={`space-${bytesToUuid(space.id.data)}`}
          />
        ));
    }

    if (spaceResponse?.children.length === 0) {
      return (
        <p className="text-white-20 text-xs">
          This space doesnt
          <br />
          have any subspaces
        </p>
      );
    }

    return spaceResponse.space.children
      .sort(sorter)
      .map((space) => (
        <SocialSpaceItem
          space={space}
          onSelect={onSpaceSelect}
          key={`space-${bytesToUuid(space.id.data)}`}
        />
      ));
  };

  return <div className="h-full overflow-y-scroll">{renderList()}</div>;
};

export default SocialSpacesList;
