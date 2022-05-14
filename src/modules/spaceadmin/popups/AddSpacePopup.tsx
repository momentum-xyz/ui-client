import React, {useEffect, useState} from 'react';

import Button from '../../../component/atoms/Button';
import Popup, {PopupTitle} from '../../../component/atoms/Popup';
import Input from '../../../component/atoms/input/Input';
import Select from '../../../component/atoms/input/Select';
import {ReactComponent as Loader} from '../../../images/tail-sping.svg';

type props = {
  onSave: (space) => void;
  onClose: () => void;
  allowedSubspaces: string[] | undefined;
  spaceName?: string;
};

export const AddSpacePopup = ({onSave, onClose, allowedSubspaces, spaceName = ''}: props) => {
  const [space, setSpace] = useState({name: '', type: ''});

  useEffect(() => {
    if (allowedSubspaces && allowedSubspaces.length > 0) {
      setSpace({
        ...space,
        type: allowedSubspaces[0]
      });
    }
  }, [allowedSubspaces]);

  const submit = (e) => {
    e.preventDefault();
    onSave(space);
  };

  const handleType = (event) => {
    event.persist();
    setSpace({
      ...space,
      type: event.target.value
    });
  };

  const handleName = (event) => {
    event.persist();
    setSpace({
      ...space,
      name: event.target.value
    });
  };

  const getSpaceName = () => {
    if (spaceName === '') return;
    else return ' "' + spaceName + '"';
  };

  const getSelectableSpaceTypes = () => {
    if (allowedSubspaces && allowedSubspaces.length > 0) {
      return allowedSubspaces.map((subSpace) => (
        <option key={subSpace} value={subSpace}>
          {subSpace.toUpperCase()}
        </option>
      ));
    }
  };

  return (
    <Popup className="w-48 transition-height">
      <PopupTitle onClose={onClose}>Create new subspace</PopupTitle>
      <p className="mb-2">You are about to create a new subspace for the space{getSpaceName()}.</p>
      <form onSubmit={submit} autoComplete="off">
        {allowedSubspaces && allowedSubspaces.length > 0 && getSelectableSpaceTypes() ? (
          <Select name="type" label="Space Type" defaultValue="" required onChange={handleType}>
            {getSelectableSpaceTypes()}
          </Select>
        ) : (
          <div className="flex items-center mt-2 gap-1 ">
            <Loader className="w-2 h-4" />
            <span className="text-white-60">Loading space types</span>
          </div>
        )}

        <Input
          type="text"
          label="Name"
          name="name"
          placeholder="Type name of the space"
          onChange={handleName}
          required
        />

        <div className="flex gap-1 mt-2">
          <Button type="primary" submit>
            Save
          </Button>
          <Button type="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Popup>
  );
};
