import {useEffect, useState} from 'react';
import {toast} from 'react-toastify';

import Button from '../../../component/atoms/Button';
import Popup, {PopupTitle} from '../../../component/atoms/Popup';
import {TokenWhitelistRequestActionDto} from '../../../context/type/Token';
import {bytesToUuid} from '../../../core/utils/uuid.utils';
import TokenListItem from '../atoms/TokenListItem';
import {useUpdateTokenStatus} from '../hooks/useTokenSpace';

export interface ReviewWhitelistPopupProps {
  onClose: () => void;
  onUpdate: () => void;
  onUpdateTokens: () => void;
  whitelist: any;
  worldSpace: any;
}

const ReviewWhitelistPopup: React.FC<ReviewWhitelistPopupProps> = ({
  onClose,
  whitelist,
  onUpdate,
  onUpdateTokens,
  worldSpace
}) => {
  const [tokenWhitelistRequestId, setTokenWhitelistRequestId] = useState<any>();
  const [tokenRequestAction, setTokenRequestAction] = useState<TokenWhitelistRequestActionDto>();
  const [updateTokenStatus, , ,] = useUpdateTokenStatus(tokenWhitelistRequestId);

  useEffect(() => {
    if (!whitelist) return;
    setTokenWhitelistRequestId(bytesToUuid(whitelist.id?.data));
  }, [whitelist]);

  // @ts-ignore
  const updateStatus = (e) => {
    e.preventDefault();
    updateTokenStatus(tokenRequestAction)
      .then(() => {
        onUpdate();
        onUpdateTokens();
        onClose();
        if (tokenRequestAction?.approved) {
          toast.success('Whitelist Request Approved', {
            autoClose: 3000
          });
        } else {
          toast.error('Whitelist Request Denied', {
            autoClose: 3000
          });
        }
      })
      .catch((e) => {
        console.info(e);
        toast.error('There was an error responding to the request, please try again.', {
          autoClose: 3000
        });
      });
  };

  return (
    <Popup className="w-36">
      <PopupTitle className="text-md font-bold" onClose={onClose}>
        Whitelist request
      </PopupTitle>
      <form onSubmit={updateStatus}>
        <TokenListItem title="token name" content={whitelist.tokenName} />
        <TokenListItem title="token type" content={whitelist.tokenType} />
        <TokenListItem title="network" content={whitelist.network.toUpperCase()} />
        <TokenListItem title="smart contract address" content={whitelist.contractAddress} />
        {/* <TokenListItem title={"additional description"} content={"whitelist.additionalDesc"} /> */}
        {worldSpace && worldSpace.admin && (
          <div className="flex justify-center gap-1 mt-2">
            <Button
              type="ghost"
              onClick={() => {
                setTokenRequestAction({approved: true});
              }}
              submit
            >
              Approve
            </Button>
            <Button
              type="deny"
              onClick={() => {
                setTokenRequestAction({approved: false});
              }}
              size="mm"
              submit
            >
              Deny
            </Button>
          </div>
        )}
      </form>
    </Popup>
  );
};

export default ReviewWhitelistPopup;
