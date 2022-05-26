import React, {useState} from 'react';

import Button from '../../../component/atoms/Button';
import Popup, {PopupTitle} from '../../../component/atoms/Popup';
import Select, {Option} from '../../../component/atoms/input/Select';
import {AssignUserDTO} from '../../../hooks/api/useSpaceService';

type props = {
  onSave: (assignUser: AssignUserDTO) => void;
  onClose: () => void;
  user: AssignUserDTO;
};

export const EditUserPopup = ({onSave, onClose, user}: props) => {
  const [editUser, setEditUser] = useState<AssignUserDTO>(user);

  // @ts-ignore
  const submit = (e) => {
    e.preventDefault();
    onSave(editUser);
  };

  // @ts-ignore
  const handleRole = (event) => {
    setEditUser({
      ...editUser,
      isAdmin: event.target.value === 'admin' ? true : false
    });
  };

  return (
    <Popup className="w-48 transition-height">
      <PopupTitle onClose={onClose}>Change member</PopupTitle>
      <form onSubmit={submit}>
        <Select
          name="role"
          label="Member role"
          onChange={handleRole}
          defaultValue={editUser.isAdmin ? 'admin' : 'member'}
        >
          <Option value="member">Member</Option>
          <Option value="admin">Admin</Option>
        </Select>
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
