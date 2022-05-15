import React, {useState} from 'react';

import Button from '../../../component/atoms/Button';
import Popup, {PopupTitle} from '../../../component/atoms/Popup';
import Input from '../../../component/atoms/input/Input';
import UserListInput from '../../../component/atoms/input/UserListInput';
import Select, {Option} from '../../../component/atoms/input/Select';

type props = {
  onSave: (userId: string, isAdmin: boolean) => void;
  onEmailSend: (email: string, isAdmin: boolean) => void;
  onClose: () => void;
  spaceName?: string;
};

export const AddUserPopup = ({onSave, onEmailSend, onClose, spaceName = ''}: props) => {
  const [admin, setAdmin] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [showDropdown, setShowDropdown] = useState(false);

  // @ts-ignore
  const validateEmail = (email) => {
    const re = /^([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+$/;
    return re.test(String(email).toLowerCase());
  };

  // @ts-ignore
  const submit = (e) => {
    e.preventDefault();
    if (selectedUserId) {
      onSave(selectedUserId, admin);
    } else if (validateEmail(query)) {
      onEmailSend(query, admin);
    } else {
      setErrorMessage('Please select a user from the dropdown list');
    }
  };

  // @ts-ignore
  const handleQueryInputChange = (event) => {
    const newQuery = event.target.value;
    setSelectedUserId(undefined);
    setShowDropdown(newQuery.length > 1);
    setQuery(newQuery);
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    setShowDropdown(false);
  };

  // @ts-ignore
  const handleRole = (event) => {
    setAdmin(event.target.value === 'admin');
  };

  const getSpaceName = () => {
    if (spaceName === '') return;
    else return ' "' + spaceName + '"';
  };

  return (
    <Popup className="w-48 transition-height">
      <PopupTitle onClose={onClose}>Invite new member</PopupTitle>

      <p className="mb-2">You are about to invite a new member to the space{getSpaceName()}.</p>

      <form onSubmit={submit}>
        <Input
          type="text"
          label="Query"
          name="url"
          defaultValue=""
          placeholder="Search for name or email"
          autoComplete="off"
          onChange={handleQueryInputChange}
          value={query}
          required
        />
        {showDropdown && (
          <UserListInput query={query} onSelect={handleUserSelect} setQuery={setQuery} />
        )}
        <Select name="role" label="Member role" onChange={handleRole} defaultValue="" required>
          <option value="" disabled>
            Select a role
          </option>
          <Option value="member">Member</Option>
          <Option value="admin">Admin</Option>
        </Select>
        {errorMessage && <p className="text-red-sunset-100">{errorMessage}</p>}
        <div className="flex gap-1 mt-2">
          {validateEmail(query) ? (
            <Button type="primary" submit>
              Invite to space
            </Button>
          ) : (
            <Button type="primary" submit>
              Add Member
            </Button>
          )}
          <Button type="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Popup>
  );
};
