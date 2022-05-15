import {useCallback, useEffect, useRef, useState} from 'react';
import {toast} from 'react-toastify';

import {request} from 'api/request';

import Panel, {PanelBody, PanelTitle} from '../../../component/atoms/Panel';
import TopbarButton from '../../../component/atoms/topbar/TopbarButton';
import {ReactComponent as TrashIcon} from '../../../images/icons/trash.svg';
import Modal, {ModalRef} from '../../../component/util/Modal';
import {useConfirmationDialog} from '../../../hooks/useConformationDialog';
import AddTokenRulePopup from '../popups/AddTokenRulePopup';
import ReviewTokenRulePopup from '../popups/ReviewTokenRulePopop';
import {TokenResponse, TokenRuleDto, TokenRuleResponse} from '../../../context/type/Token';
import {bytesToUuid} from '../../../core/utils/uuid.utils';

export interface TokenRulesPanelViewProps {
  whitelists: TokenResponse;
  tokenRulesList: TokenRuleResponse;
  onUpdate: () => void;
  spaceId: string;
}

const TokenRulesPanelView: React.FC<TokenRulesPanelViewProps> = ({
  whitelists,
  tokenRulesList,
  onUpdate,
  spaceId
}) => {
  const [tokenRules, setTokenRules] = useState<any>([]);
  const addTokenRuleModal = useRef<ModalRef>(null);
  const tokenRuleReviewModal = useRef<ModalRef>(null);
  // const tokenRuleDeleteModal = useRef<ModalRef>(null);
  const {getConfirmation} = useConfirmationDialog();
  const [tokenRuleReview, setTokenRuleReview] = useState<TokenRuleDto | undefined>();
  // const [tokenRuleDelete, setTokenRuleDelete] = useState<any>();

  useEffect(() => {
    if (!tokenRulesList) return;
    setTokenRules(tokenRulesList?.tokenRules);
  }, [tokenRulesList]);

  const openAddTokenRuleModal = () => {
    addTokenRuleModal.current?.open();
  };

  const confirmRemoveToken = useCallback(
    (item) => {
      getConfirmation({
        blockInterface: true,
        title: 'Remove Token Rule',
        message: 'Are you sure you want to remove the ' + item.tokenRuleName + ' ?',
        confirmButton: 'Yes, remove',
        cancelButton: 'No, cancel'
      }).then(async (result) => {
        if (result) {
          try {
            const response = await request.delete(
              window._env_.BACKEND_ENDPOINT_URL + '/token-rule/' + bytesToUuid(item.id.data)
            );
            onUpdate();
            if (response.status) {
              toast.success('The token rule was removed successfully', {
                autoClose: 3000
              });
            } else {
              toast.error('There was an error removing the token rule', {
                autoClose: 3000
              });
            }
          } catch (e) {
            console.error(e);
            toast.error('There was an error removing the token rule', {
              autoClose: 3000
            });
          }
        }
      });
    },
    [getConfirmation]
  );

  // @ts-ignore
  const openTokenRuleItem = (item) => {
    setTokenRuleReview(item);
    tokenRuleReviewModal.current?.open();
  };

  const renderTokenRules = () => {
    if (!tokenRules) return;
    // @ts-ignore
    const rows = tokenRules.map((item, i) => (
      <div
        key={i}
        className="w-full flex items-start cursor-pointer justify-between p-2 border-b-1 border-black-50"
      >
        <div onClick={() => openTokenRuleItem(item)} className="flex-1 truncate">
          <h3 className="text-prime-blue-100 text-base font-bold font-sans truncate">
            {item?.tokenRuleName}
          </h3>
        </div>
        <div className="flex">
          {/*           <TopbarButton title="Edit member" 
          onClick={() => editUser(item)}><PencilIcon className="text-prime-blue-100"  />
          </TopbarButton>
                          <TopbarButton 
                            title="Remove Token Rule" 
                            onClick={tokenRule) =>confirmRemoveToken(tokenRule)}>
                            <TrashIcon className="text-prime-blue-100" /></TopbarButton> */}

          <TopbarButton title="Remove Token Rule" onClick={() => confirmRemoveToken(item)}>
            <TrashIcon className="text-prime-blue-100" />
          </TopbarButton>
        </div>
      </div>
    ));

    return rows;
  };

  return (
    <>
      <Panel>
        <PanelTitle onAddAction={openAddTokenRuleModal} addLabel="Add Token Rule">
          Token Rules
        </PanelTitle>

        <PanelBody scroll={true}>{renderTokenRules()}</PanelBody>
      </Panel>

      <Modal ref={addTokenRuleModal}>
        <AddTokenRulePopup
          whitelists={whitelists}
          onClose={() => addTokenRuleModal.current?.close()}
          onUpdate={onUpdate}
          spaceId={spaceId}
        />
      </Modal>

      <Modal ref={tokenRuleReviewModal}>
        <ReviewTokenRulePopup
          onClose={() => tokenRuleReviewModal.current?.close()}
          tokenRule={tokenRuleReview}
        />
      </Modal>

      {/* <Modal ref={tokenRuleDeleteModal}>
				<TokenRuleDeletePopup
					onClose={() => tokenRuleDeleteModal.current?.close()}
          tokenRule ={tokenRuleDelete}
          onUpdate={onUpdate}
				/>
			</Modal> */}
    </>
  );
};

export default TokenRulesPanelView;
