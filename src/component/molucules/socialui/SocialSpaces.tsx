import React, {useEffect, useState} from 'react';

import {useGetSpace, useSpaceSearch} from '../../../hooks/api/useSpaceService';
import {bytesToUuid} from '../../../core/utils/uuid.utils';
import {ReactComponent as ExploreIcon} from '../../../images/icons/astronomy-telescope.svg';
import {Space} from '../../../context/type/Space';
import SocialSearch, {SocialSearchMinimalCharacters} from '../../atoms/socialui/SocialSearch';

import SocialPanel from './SocialPanel';
import SocialSpacesList from './SocialSpacesList';
import SocialSelectedSpace from './SocialSelectedSpace';

export interface SocialSpacesProps {
  isOpen: boolean;
  setIsOpen: (boolean) => void;
  worldId: string;
  selectedUserInitiative: Buffer | undefined;
  setSelectedUserInitiative: (spaceId: Buffer | undefined) => void;
}

const SocialSpaces: React.FC<SocialSpacesProps> = ({
  isOpen,
  setIsOpen,
  worldId,
  selectedUserInitiative,
  setSelectedUserInitiative
}) => {
  const [spaceResponse] = useGetSpace(worldId);
  const [selectedSpace, setSelectedSpace] = useState<Buffer>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedSpaces, setSearchedSpaces] = useState<Space[]>([]);
  const [searchDebounceInterval, setSearchDebounceInterval] = useState<NodeJS.Timeout>();
  const search = useSpaceSearch();

  useEffect(() => {
    if (selectedUserInitiative) {
      setSelectedSpace(selectedUserInitiative);
    }
  }, [selectedUserInitiative]);

  useEffect(() => {
    if (searchDebounceInterval) {
      clearInterval(searchDebounceInterval);
      setSearchDebounceInterval(undefined);
    }

    setSearchDebounceInterval(
      setTimeout(() => {
        if (searchQuery.length >= SocialSearchMinimalCharacters) {
          search(searchQuery, worldId).then((response) => {
            setSearchedSpaces(response.results);
          });
        } else {
          setSearchedSpaces([]);
        }
      }, 200)
    );

    return () => {
      if (searchDebounceInterval) {
        clearInterval(searchDebounceInterval);
        setSearchDebounceInterval(undefined);
      }
    };
  }, [searchQuery, worldId]);

  const handleGoBackClick = () => {
    setSelectedSpace(undefined);
    setSelectedUserInitiative(undefined);
  };

  return (
    <SocialPanel
      headerIcon={<ExploreIcon className="w-1.6 h-1.6" />}
      title="Explore"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      position="left"
    >
      <SocialSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search for spaces..."
      />
      <div className="flex flex-col h-full overflow-hidden">
        {!selectedSpace && (
          <div className="flex items-center px-1 space-x-.5 py-.7" onClick={handleGoBackClick}>
            <p className="text-lg text-green-light-90 uppercase font-bold">
              {spaceResponse?.space.name}
            </p>
          </div>
        )}
        {selectedSpace && (
          <SocialSelectedSpace
            spaceId={bytesToUuid(selectedSpace)}
            fatherSpaceName={spaceResponse?.space.name ?? ''}
            ancestors={spaceResponse?.space.name ? [spaceResponse.space.name] : []}
            onBack={handleGoBackClick}
          />
        )}
        {!selectedSpace && spaceResponse && (
          <SocialSpacesList
            spaceId={spaceResponse.space.id.data}
            onSpaceSelect={setSelectedSpace}
            searchQuery={searchQuery}
            searchedSpaces={searchedSpaces}
          />
        )}
      </div>
    </SocialPanel>
  );
};

export default SocialSpaces;
