import React from 'react';

import {useFindUser} from '../../../hooks/api/useUserService';
import {bytesToUuid} from '../../../core/utils/uuid.utils';

export interface UserInputProps {
  query: string;
  onSelect: (id: string) => void;
  setQuery: (query: string) => void;
}

const UserListInput: React.FC<UserInputProps> = ({query, onSelect, setQuery}) => {
  const [userResponse] = useFindUser(query);

  const handleItemSelect = (event, item) => {
    event.preventDefault();
    onSelect(bytesToUuid(item.id.data));
    setQuery(item.name);
  };

  const userListOptions = () => {
    return userResponse?.results.map((item, index) => (
      <button className="p-1" key={index} onClick={(e) => handleItemSelect(e, item)}>
        {item.name}
      </button>
    ));
  };

  return (
    <>
      <div className="flex flex-col items-start bg-black-100 fixed z-autocomplete-list">
        {userListOptions()}
      </div>
    </>
  );
};

export default UserListInput;
