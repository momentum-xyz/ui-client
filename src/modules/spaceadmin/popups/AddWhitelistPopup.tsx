import {useEffect, useState} from 'react';

import Button from '../../../component/atoms/Button';
import Input from '../../../component/atoms/input/Input';
import Select, {Option} from '../../../component/atoms/input/Select';
import Popup, {PopupTitle} from '../../../component/atoms/Popup';
import {NetworkType, TokenDto, TokenType} from '../../../context/type/Token';
import {bytesToUuid} from '../../../core/utils/uuid.utils';

export interface AddWhitelistPopupProps {
  // @ts-ignore
  onSave: (TokenDto) => void;
  onClose: () => void;
  worldId: Buffer;
  spaceId: string;
}

const AddWhitelistPopup: React.FC<AddWhitelistPopupProps> = ({
  onSave,
  onClose,
  worldId,
  spaceId
}) => {
  const [tokenTypes] = useState(Object.values(TokenType));
  const [networks] = useState(Object.values(NetworkType));
  const [tokenRule, setTokenRule] = useState();
  const [smartCotract, setSmartContract] = useState();
  const [, setNetwork] = useState();
  const [, setAssetType] = useState();
  const [whitelist, setWhitelist] = useState<TokenDto>();

  useEffect(() => {
    if (!whitelist)
      {setWhitelist({status: 'PENDING', worldId: bytesToUuid(worldId), spaceId: spaceId});}
  }, [whitelist]);

  // @ts-ignore
  const submit = (e) => {
    e.preventDefault();
    onSave(whitelist);
  };

  // @ts-ignore
  const handleAsset = (event) => {
    event.persist();
    setWhitelist({
      ...whitelist,
      tokenType: event.target.value
    });
    setAssetType(event.target.value);
  };

  // @ts-ignore
  const handleNetwork = (event) => {
    event.persist();
    setWhitelist({
      ...whitelist,
      network: event.target.value.toLowerCase()
    });
    setNetwork(event.target.value);
  };

  // @ts-ignore
  const handleTokenRuleInputChange = (event) => {
    event.persist();
    setWhitelist({
      ...whitelist,
      tokenName: event.target.value
    });
    setTokenRule(event.target.value);
  };

  // @ts-ignore
  const handleSmartContractInputChange = (event) => {
    event.persist();
    setWhitelist({
      ...whitelist,
      contractAddress: event.target.value
    });
    setSmartContract(event.target.value);
  };

  return (
    <Popup className="w-40">
      <PopupTitle className="text-md font-bold" onClose={onClose}>
        request whitelist
      </PopupTitle>

      <form onSubmit={submit}>
        <Input
          type="text"
          label="token name"
          placeholder="Token Name"
          autoComplete="off"
          onChange={handleTokenRuleInputChange}
          value={tokenRule || ''}
          required
        />
        <Select
          className=""
          name="token"
          label="token type *"
          onChange={handleAsset}
          defaultValue=""
          required
        >
          <option value="" disabled>
            Select a Token Type
          </option>
          {tokenTypes.map((token) => (
            <Option key={token} value={token || ''}>
              {token}
            </Option>
          ))}
        </Select>
        <Select
          className=""
          name="role"
          label="network *"
          onChange={handleNetwork}
          defaultValue=""
          required
        >
          <option value="" disabled>
            Select a Network
          </option>
          {networks.map((network) => (
            <Option className="uppercase" key={network} value={network || ''}>
              {network}
            </Option>
          ))}
        </Select>
        <div className="" />
        <Input
          type="text"
          label="smart contract address *"
          placeholder="Smart Contract Address"
          autoComplete="off"
          onChange={handleSmartContractInputChange}
          value={smartCotract || ''}
          required
        />
        {/* <Input 
                    type="text"
                    label="additional description"
                    placeholder="Additional Description"
                    autoComplete="off"
                    onChange={handleAddictionalDescInputChange}
                    value={additionaldesc||''}

                /> */}
        <div className=" flex justify-center mt-2">
          <Button type="ghost" submit>
            Request
          </Button>
        </div>
      </form>
    </Popup>
  );
};

export default AddWhitelistPopup;
