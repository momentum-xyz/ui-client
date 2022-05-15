import React, {useRef, useState} from 'react';

import Input, {InputRef} from '../input/Input';
import UnityService from '../../../context/Unity/UnityService';
import {ReactComponent as SearchIcon} from '../../../images/icons/search.svg';

interface SocialSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
}

export const SocialSearchMinimalCharacters = 2;

const SocialSearch: React.FC<SocialSearchProps> = ({searchQuery, setSearchQuery, placeholder}) => {
  const [searchHovered, setSearchHovered] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const ref = useRef<InputRef>(null);

  // @ts-ignore
  const handleQueryInputChange = (event) => {
    const newQuery = event.target.value;
    setSearchQuery(newQuery);
  };

  return (
    <div className={`flex items-center pr-1 ${searchHovered || searchFocused ? 'bg-white-5' : ''}`}>
      <Input
        ref={ref}
        transparent
        value={searchQuery}
        onChange={handleQueryInputChange}
        placeholder={placeholder}
        onFocus={() => {
          UnityService.setKeyboardControl(false);
          setSearchFocused(true);
        }}
        onBlur={() => {
          UnityService.setKeyboardControl(true);
          setSearchFocused(false);
        }}
        onMouseEnter={() => setSearchHovered(true)}
        onMouseLeave={() => setSearchHovered(false)}
        className={`bg-transparant mt-1 py-0 px-1 h-full 
          ${
            searchHovered || searchFocused
              ? 'outline-none placeholder-white-80 placeholder-white-80'
              : ''
          }`}
      />
      <SearchIcon
        className={searchHovered || searchFocused ? 'text-green-light-100 stroke-current' : ''}
        onMouseEnter={() => setSearchHovered(true)}
        onMouseLeave={() => setSearchHovered(false)}
        onClick={() => ref.current?.focus()}
      />
    </div>
  );
};

export default SocialSearch;
