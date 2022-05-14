import {useEffect, useRef, useState} from 'react';

import Panel, {PanelBody, PanelTitle} from '../../../component/atoms/Panel';
import Modal, {ModalRef} from '../../../component/util/Modal';
import ReviewWhitelistPopup from '../popups/ReviewWhitelistPopup';
import {TokenDto} from '../../../context/type/Token';
import {bytesToUuid} from '../../../core/utils/uuid.utils';
import {useGetSpace} from '../../../hooks/api/useSpaceService';

export interface WhitelistRequestsPanelProps {
  whitelistItems: any;
  onUpdateTokens: () => void;
  onUpdate: () => void;
  currentWorld: Buffer;
}

const WhitelistRequestsPanel: React.FC<WhitelistRequestsPanelProps> = ({
  whitelistItems,
  onUpdateTokens,
  onUpdate,
  currentWorld
}) => {
  const [whitelists, setWhitelists] = useState<any>([]);
  const reviewWhitelistModal = useRef<ModalRef>(null);
  const [reviewWhitelist, setReviewWhitelist] = useState<TokenDto>();
  const [worldSpace] = useGetSpace(bytesToUuid(currentWorld));

  useEffect(() => {
    if (!whitelistItems) return;
    setWhitelists(whitelistItems.tokenWhitelistRequests);
  }, [whitelistItems]);

  const openReviewWhitelist = (item) => {
    setReviewWhitelist(item);
    reviewWhitelistModal.current?.open();
  };
  // whitelists are being filtered in the backend to be shown only those with pending status
  const renderWhitelistRequests = () => {
    if (whitelists.length < 1 || !whitelists) return;
    return whitelists.map((item, i) => (
      <div
        key={i}
        onClick={() => openReviewWhitelist(item)}
        className="w-full flex items-start justify-between p-2 border-b-1 border-black-50 cursor-pointer"
      >
        <div className="flex-1 truncate">
          <h3 className="text-prime-blue-100 text-base font-bold font-sans truncate">
            {item.tokenName}
          </h3>
        </div>
      </div>
    ));
  };

  return (
    <>
      <Panel>
        <PanelTitle addLabel="Add member">Whitelist Requests</PanelTitle>

        <PanelBody scroll={true}>{renderWhitelistRequests()}</PanelBody>
      </Panel>

      <Modal ref={reviewWhitelistModal}>
        <ReviewWhitelistPopup
          onClose={() => reviewWhitelistModal.current?.close()}
          whitelist={reviewWhitelist}
          onUpdate={onUpdate}
          onUpdateTokens={onUpdateTokens}
          worldSpace={worldSpace}
        />
      </Modal>
    </>
  );
};

export default WhitelistRequestsPanel;
