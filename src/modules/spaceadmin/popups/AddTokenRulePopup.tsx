import {useEffect, useState} from 'react';
import {toast} from 'react-toastify';

import Button from '../../../component/atoms/Button';
import Input from '../../../component/atoms/input/Input';
import Select, {Option} from '../../../component/atoms/input/Select';
import Popup, {PopupTitle} from '../../../component/atoms/Popup';
import {
  TokenDto,
  TokenResponse,
  TokenRule,
  TokenRuleEnvelopeDto
} from '../../../context/type/Token';
import {bytesToUuid} from '../../../core/utils/uuid.utils';
import TokenDetails from '../atoms/TokenDetails';
import {useCreateTokenRule} from '../hooks/useTokenSpace';

export interface AddTokenRulePopopProps {
  whitelists: TokenResponse;
  onClose: () => void;
  onUpdate: () => void;
  spaceId: string;
}

const AddTokenRulePopup: React.FC<AddTokenRulePopopProps> = ({
  whitelists,
  onClose,
  onUpdate,
  spaceId
}) => {
  const [whitelistItems, setWhitelistItems] = useState<TokenDto[]>();
  const [selectedToken, setSelectedToken] = useState<TokenDto>();
  const [tokenRuleName, setTokenRuleName] = useState();
  const [minimumBalance, setMinimumBalance] = useState();
  const [tokenRule, setTokenRule] = useState<TokenRuleEnvelopeDto>();
  const [createTokenRule, , ,] = useCreateTokenRule();
  const [rule, setRule] = useState<TokenRule>();
  const [tokenid, setTokenid] = useState<any>();

  useEffect(() => {
    if (!whitelists) {
      return;
    }
    setWhitelistItems(whitelists.token);
  }, [whitelists]);

  useEffect(() => {
    setTokenRule({
      spaceId: spaceId
    });
  }, [spaceId]);

  useEffect(() => {
    setTokenRule({
      ...tokenRule,
      rule: rule
    });
  }, [rule]);

  useEffect(() => {
    setTokenid(selectedToken?.id?.data);
  }, [selectedToken]);

  useEffect(() => {
    if (!tokenid) {
      return;
    }
    setTokenRule({
      ...tokenRule,
      tokenId: bytesToUuid(tokenid),
      spaceId: spaceId
    });
  }, [tokenid]);

  // @ts-ignore
  const submit = (e) => {
    e.preventDefault();
    createTokenRule(tokenRule)
      .then(() => {
        onClose();
        onUpdate();
        toast.success('Token rule added successfully.', {
          autoClose: 3000
        });
      })
      .catch((e) => {
        console.info(e);
        toast.error('There was an error creating the request, please try again.', {
          autoClose: 3000
        });
      });
  };

  // @ts-ignore
  const handleTokenRuleNameInputChange = (event) => {
    event.persist();
    setTokenRule({
      ...tokenRule,
      name: event.target.value
    });
    setTokenRuleName(event.target.value);
  };

  // @ts-ignore
  const handleTokenSelect = (event) => {
    event.persist();
    if (!whitelistItems) {
      return;
    }
    setSelectedToken(whitelistItems[event.target.value]);
  };

  // @ts-ignore
  const handleMinimumBalanceChange = (event) => {
    event.persist();
    setRule({...rule, minBalance: Number(event.target.value)});
    setMinimumBalance(event.target.value);
  };

  return (
    <Popup className="w-40 transition-height">
      <PopupTitle onClose={onClose}>Add token rule</PopupTitle>
      <p className="mb-2">Add a token gated access rule to your space.</p>
      <form onSubmit={submit}>
        <Input
          type="text"
          label="token rule name"
          placeholder="Token Rule Name"
          autoComplete="off"
          onChange={handleTokenRuleNameInputChange}
          value={tokenRuleName || ''}
          required
        />
        <Select name="token" label="token" onChange={handleTokenSelect} defaultValue="" required>
          <option value="" disabled>
            Select a Token
          </option>
          {whitelistItems &&
            whitelistItems.map((token, index) => (
              <Option key={token.createdAt} value={index}>
                {token.tokenName}
              </Option>
            ))}
        </Select>
        {/* <label htmlFor="token"
                    className="block pt-2 mb-1 font-bold text-white-100 font-sans text-sm uppercase">token</label>
                    <div className="">
                <select
                    className={`bg-black-50 border-none h-4 px-1.5 mb-1
                    text-white-100 font-normal text-base font-sans w-full 
                    focus:ring-red-sunset-40 focus:bg-red-sunset-20 focus:border-red-sunset-80`}
                    name='token'
                    onChange={handleTokenSelect}
                >
                    <option value="dis" disabled selected>Select a Token</option>
                    {whitelistItems&& whitelistItems.map((token,index)=>(
                    <option key={token.createdAt} value={index} >{token.tokenName}</option>
                    ))}
                </select>
                </div> */}
        {selectedToken && <TokenDetails title="Network" content={selectedToken?.network} />}{' '}
        {selectedToken && (
          <TokenDetails title="smart contract address" content={selectedToken?.contractAddress} />
        )}
        <Input
          type="text"
          label="minimum balance required"
          placeholder="Minimum Balance"
          autoComplete="off"
          pattern="[0-9]*"
          onChange={handleMinimumBalanceChange}
          value={minimumBalance || ''}
          required
        />
        <div className="flex justify-center gap-1 mt-2">
          <Button type="primary" submit>
            Add Rule
          </Button>
        </div>
      </form>
    </Popup>
  );
};

export default AddTokenRulePopup;
