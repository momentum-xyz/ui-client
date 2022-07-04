import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';

import {youtubeVideoPath} from 'core/utils';
import {BroadcastStatusEnum, IntegrationTypeEnum} from 'core/enums';

import Page from '../../../component/molucules/Page';
import {useGetSpace} from '../../../hooks/api/useSpaceService';
import Panel, {PanelBody, PanelTitle} from '../../../component/atoms/Panel';
import Input from '../../../component/atoms/input/Input';
import Button from '../../../component/atoms/Button';
import {CountdownPopup} from '../popups/CountdownPopup';
import Modal, {ModalRef} from '../../../component/util/Modal';
import {useConfirmationDialog} from '../../../hooks/useConformationDialog';
import {
  useIntegrationDisable,
  useIntegrationEnable,
  useIntegrationFetch
} from '../../../context/Integration/hooks/useIntegration';
import {IntegrationDTO} from '../../../context/Integration/IntegrationTypes';

export interface Broadcast {
  data: {
    url: string;
    youtubeUrl: string;
    broadcastStatus: BroadcastStatusEnum;
  };
}

const BroadCastAdminLayout: React.FC = () => {
  const {spaceId} = useParams<{spaceId: string}>();

  const [url, setUrl] = useState<string>('');
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const showCountdownModal = useRef<ModalRef>(null);

  const [broadcast] = useIntegrationFetch(spaceId, IntegrationTypeEnum.BROADCAST);
  const [updateBroadcast] = useIntegrationEnable();
  const [stopBroadcast] = useIntegrationDisable();

  const {getConfirmation} = useConfirmationDialog();

  const [spaceResponse, , ,] = useGetSpace(spaceId);

  useEffect(() => {
    setUrl(youtubeVideoPath(youtubeUrl, undefined));
  }, [youtubeUrl]);

  useEffect(() => {
    if (broadcast) {
      setUrl(broadcast.data.url ?? '');
      setYoutubeUrl(broadcast.data.youtubeUrl ?? '');
      setIsBroadcasting(broadcast.data.broadcastStatus === BroadcastStatusEnum.PLAY);
    }
  }, [broadcast]);

  const update = async () => {
    const integration: IntegrationDTO = {
      integrationType: IntegrationTypeEnum.BROADCAST,
      spaceId: spaceId,
      data: {
        url: url,
        youtubeUrl: youtubeUrl,
        broadcastStatus: BroadcastStatusEnum.PLAY
      }
    };

    await updateBroadcast(integration);
    setIsBroadcasting(true);
  };

  const stop = async () => {
    const integration: IntegrationDTO = {
      integrationType: IntegrationTypeEnum.BROADCAST,
      spaceId: spaceId,
      data: {
        url: '',
        youtubeUrl: '',
        broadcastStatus: BroadcastStatusEnum.STOP
      }
    };

    await stopBroadcast(integration);
    setIsBroadcasting(false);
  };

  const confirmEndBroadcast = useCallback(() => {
    getConfirmation({
      blockInterface: true,
      title: 'End broadcast',
      message: 'Are you sure you want to end the broadcast?',
      confirmButton: 'Yes, end broadcast',
      cancelButton: 'No, cancel'
    }).then((result) => {
      if (result) {
        stop();
      }
    });
  }, [getConfirmation]);

  const subSpaceslist = () => {
    return spaceResponse?.children.map((item, i) => (
      <li className="text-base font-bold font-sans truncate" key={i}>
        {item.name}
      </li>
    ));
  };

  const getView = () => {
    if (spaceResponse && spaceResponse?.admin) {
      return (
        <section className="flex gap-1 w-full">
          {!isBroadcasting && (
            <Panel>
              <PanelTitle>BroadCast</PanelTitle>
              <PanelBody scroll={true}>
                <p className="mb-2 text-base font-sans">
                  Broadcasting allows you to send out a message to this space and the spaces below.
                  Add a youtube url to start broadcasting. What would you like to broadcast?
                </p>
                <div className="w-full flex items-start justify-between p-1.5 border-b-1 mb-1 border-prime-blue-20"></div>
                <div className="w-full border-b-1 mb-1 py-1.5 border-prime-blue-20">
                  <p className="mb-2">Add a youtube url which you would like to broadcast:</p>

                  <Input
                    type="text"
                    name="name"
                    label="Youtube video url"
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    defaultValue={youtubeUrl}
                    autoComplete="off"
                  />
                </div>

                <div className="w-full mb-1 py-1.5">
                  <p className="mb-2">
                    The broadcast will be sent to the following spaces and their subspaces:
                  </p>
                  <ul>
                    <li className="text-base font-bold font-sans truncate">
                      {spaceResponse?.space?.name}
                    </li>
                    {subSpaceslist()}
                  </ul>
                </div>
              </PanelBody>
            </Panel>
          )}

          <Panel>
            <PanelTitle>{isBroadcasting ? 'Currently broadcasting' : 'Preview'}</PanelTitle>
            <PanelBody scroll={true}>
              {url && (
                <div
                  className={
                    isBroadcasting ? 'max-w-[32rem] mx-auto p-1.5' : 'max-w-[24rem] mx-auto p-1.5'
                  }
                >
                  <div className="broadcast-video">
                    <iframe
                      title="Livestream"
                      src={`https://www.youtube.com/embed/${url}/?autoplay=1`}
                      /* @ts-ignore */
                      frameBorder="0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  </div>
                  <div className="flex w-full items-center justify-center py-1.5">
                    <Button
                      type={isBroadcasting ? 'ghost-red' : 'primary'}
                      size="m"
                      onClick={() => {
                        if (isBroadcasting) {
                          confirmEndBroadcast();
                        } else {
                          showCountdownModal.current?.open();
                        }
                      }}
                    >
                      {isBroadcasting ? 'End broadcast' : 'Start broadcast'}
                    </Button>
                  </div>
                </div>
              )}
              {!url && (
                <div className="flex items-center justify-center py-1.5">
                  <p className="text-base font-sans">No media for broadcasting supplied yet.</p>
                </div>
              )}
            </PanelBody>
          </Panel>
          <Modal ref={showCountdownModal}>
            <CountdownPopup
              title="Starting Broadcast"
              onClose={() => showCountdownModal.current?.close()}
              onSave={() => {
                showCountdownModal.current?.close();
                update();
              }}
            />
          </Modal>
        </section>
      );
    } else {
      return (
        <Panel grow={true}>
          <div className="flex flex-col h-full justify-center items-center gap-4">
            <h2 className="font-bold">You don't have any access rights to manage broadcasts</h2>
          </div>
        </Panel>
      );
    }
  };

  return (
    <Page
      title={spaceResponse?.space?.name || ''}
      subtitle="Manage Broadcast"
      isAdmin={spaceResponse?.admin}
    >
      {getView()}
    </Page>
  );
};

export default BroadCastAdminLayout;
