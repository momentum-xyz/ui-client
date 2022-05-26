import {useEffect} from 'react';

import Button from '../../../component/atoms/Button';
import Popup, {PopupTitle} from '../../../component/atoms/Popup';
import {bytesToUuid} from '../../../core/utils/uuid.utils';

export interface ReviewTokenRulePopupProps {
  onClose: () => void;
  tokenRule: any;
  onUpdate: () => void;
}

const ReviewTokenRulePopup: React.FC<ReviewTokenRulePopupProps> = ({onClose, tokenRule}) => {
  // const [removeTokenRuleEP, responseData , , ] = useRemoveTokenRule(bytesToUuid(tokenRule?.id?.data));
  // const removeToken = useRemoveToken(bytesToUuid(tokenRule?.id?.data));

  useEffect(() => {
    console.info(bytesToUuid(tokenRule?.id?.data));
  }, [tokenRule]);

  const submit = () => {
    // removeToken();
    // removeToken().then((response) => {
    //     onUpdate();
    //     console.info("RESPONSE", response)
    //     toast.success('The token rule was removed successfully', {
    //         autoClose: 3000,
    //     });
    // }).catch((error)=>{
    //     toast.error('There was an error removing the token rule', {
    //         autoClose: 3000,
    //     });
    // });
  };

  return (
    <Popup className="w-32">
      <PopupTitle className="text-md font-bold" onClose={onClose}>
        Remove {tokenRule?.tokenRuleName}
      </PopupTitle>
      <form onSubmit={submit}>
        <p>Are you sure you want to delete this token rule?</p>
        <div className="flex gap-1 mt-2">
          <Button type="primary" submit>
            Delete
          </Button>
          <Button type="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Popup>
  );
};

export default ReviewTokenRulePopup;
