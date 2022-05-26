import {useRef} from 'react';
import {toast} from 'react-toastify';

import Button from '../../../component/atoms/Button';
import Panel, {PanelBody, PanelTitle} from '../../../component/atoms/Panel';
import Modal, {ModalRef} from '../../../component/util/Modal';
import {useCreateWhitelist} from '../hooks/useTokenSpace';
import AddWhitelistPopup from '../popups/AddWhitelistPopup';
import {ReactComponent as CloseIcon} from '../../../images/icons/close.svg';
import AddTokenRulePopup from '../popups/AddTokenRulePopup';
import {TokenResponse} from '../../../context/type/Token';

export interface TokenManagementViewpProps {
  whitelists: TokenResponse;
  onUpdate: () => void;
  UpdateRules: () => void;
  spaceId: string;
  worldId: Buffer;
}

const TokenManagementView: React.FC<TokenManagementViewpProps> = ({
  whitelists,
  onUpdate,
  UpdateRules,
  spaceId,
  worldId
}) => {
  const addTokenRuleModal = useRef<ModalRef>(null);
  const addWhitelistModal = useRef<ModalRef>(null);
  const [createWhitelist, , ,] = useCreateWhitelist();

  const showSuccessWhitelistSubmissionToast = () => {
    const Content: React.FC = () => {
      return (
        <div className="flex flex-row">
          <div>
            <h2 className="font-bold text-white-100 uppercase ">Whitelist requested</h2>
            <p>
              You successfully create a token whitelist request, please wait for the admin to
              respond to your request.
            </p>
          </div>
          <div className="flex flex-row gap-1">
            <button>
              <CloseIcon className="w-2 h-2 float-right inline-block filter hover:drop-shadow-white focus-within:drop-shadow-white" />
            </button>
          </div>
        </div>
      );
    };

    toast(<Content />, {
      closeOnClick: true,
      autoClose: false,
      closeButton: false,
      progress: 0,
      draggable: false
    });
  };

  // @ts-ignore
  const saveWhitelist = (whiteList) => {
    createWhitelist(whiteList)
      .then(() => {
        onUpdate();
        addWhitelistModal.current?.close();
        showSuccessWhitelistSubmissionToast();
      })
      .catch((e) => {
        console.error(e);
        toast.error('There was an error creating the request, please try again.', {
          autoClose: 3000
        });
      });
  };

  const openAddTokenRuleModal = () => {
    addTokenRuleModal.current?.open();
  };

  const openWhitelistModal = () => {
    addWhitelistModal.current?.open();
  };

  return (
    <>
      <Panel className="h-2/6">
        <PanelTitle>Token Control</PanelTitle>

        <PanelBody scroll={true}>
          <div className="grid justify-items-center gap-3 px-4 mt-3 pb-3">
            <Button size="m" onClick={openAddTokenRuleModal} block type="primary">
              <div className="text-xs items-center uppercase ">add token rule</div>
            </Button>
            <Button size="m" onClick={openWhitelistModal} block type="ghost">
              <div className="text-xs items-center uppercase ">request whitelist</div>
            </Button>
          </div>
        </PanelBody>
      </Panel>

      <Modal ref={addTokenRuleModal}>
        <AddTokenRulePopup
          whitelists={whitelists}
          onClose={() => addTokenRuleModal.current?.close()}
          onUpdate={UpdateRules}
          spaceId={spaceId}
        />
      </Modal>

      <Modal ref={addWhitelistModal}>
        <AddWhitelistPopup
          onClose={() => addWhitelistModal.current?.close()}
          onSave={saveWhitelist}
          worldId={worldId}
          spaceId={spaceId}
        />
      </Modal>
    </>
  );
};

export default TokenManagementView;
