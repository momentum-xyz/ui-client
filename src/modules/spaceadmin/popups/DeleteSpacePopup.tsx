import React, {useState} from 'react';

import Button from '../../../component/atoms/Button';
import Popup, {PopupTitle} from '../../../component/atoms/Popup';
import Input from '../../../component/atoms/input/Input';
import {Space} from '../../../context/type/Space';

type props = {
  // @ts-ignore: TODO: Refactor
  onSave: (space) => void;
  onClose: () => void;
  space: Space;
};

export const DeleteSpacePopup = ({onSave, onClose, space}: props) => {
  const [confirmName, setConfirmName] = useState<string>('');

  // @ts-ignore: TODO: Refactor
  const submit = (e) => {
    e.preventDefault();
    //check name the same
    if (confirmName === space.name) {onSave(space);}
  };

  // @ts-ignore: TODO: Refactor
  const handleName = (event) => {
    event.persist();
    setConfirmName(event.target.value);
  };

  return (
    <Popup className="w-48 transition-height">
      <PopupTitle onClose={onClose}>Delete space</PopupTitle>
      <p className="mb-2">
        You are about to delete the space <span className="font-bold">{space.name}</span>.
      </p>
      <p className="mb-2">
        <span className="font-bold">This could have major impact!</span> For safety measures you
        have to type the name of the space to confirm that it can be deleted.
      </p>
      <form onSubmit={submit}>
        <Input
          type="text"
          label="Confirm space name"
          name="name"
          placeholder="Type name of the space"
          onChange={handleName}
          required
        />

        {confirmName !== space.name && (
          <p className="text-xs text-white-50">The name does not yet match</p>
        )}

        <div className="flex gap-1 mt-2">
          <Button type="ghost-red" submit disabled={confirmName !== space.name}>
            Confirm Delete
          </Button>
          <Button type="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Popup>
  );
};
