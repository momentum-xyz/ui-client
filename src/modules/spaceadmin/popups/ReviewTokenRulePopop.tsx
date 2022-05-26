import Popup, {PopupTitle} from '../../../component/atoms/Popup';
import {TokenRuleDto} from '../../../context/type/Token';
import TokenListItem from '../atoms/TokenListItem';

export interface ReviewTokenRulePopupProps {
  onClose: () => void;
  tokenRule: TokenRuleDto | undefined;
}

const ReviewTokenRulePopup: React.FC<ReviewTokenRulePopupProps> = ({onClose, tokenRule}) => {
  return (
    <Popup className="w-36">
      <PopupTitle className="text-md font-bold" onClose={onClose}>
        token rule
      </PopupTitle>
      <form>
        <TokenListItem title="token rule name" content={tokenRule?.tokenRuleName} />
        <TokenListItem title="token name" content={tokenRule?.token?.tokenName} />
        <TokenListItem title="token type" content={tokenRule?.token?.tokenType} />
        <TokenListItem title="network" content={tokenRule?.token?.network} />
        <TokenListItem title="smart contract address" content={tokenRule?.token?.contractAddress} />
        <TokenListItem title="minimum balance" content={tokenRule?.rule?.minBalance} />
      </form>
    </Popup>
  );
};

export default ReviewTokenRulePopup;
