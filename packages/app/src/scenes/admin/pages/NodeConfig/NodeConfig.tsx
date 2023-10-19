import {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, Frame, Input, Panel, TabInterface, Tabs} from '@momentum-xyz/ui-kit';
import BN from 'bn.js';

import {useBlockchain, useStore} from 'shared/hooks';

import {ApiKeys, BlockchainRegistration} from './components';
import * as styled from './NodeConfig.styled';

const NODE_ADDING_FEE = new BN('4200000000000000000');

const NodeOdysseyMapping: FC = () => {
  const {nftStore, adminStore} = useStore();
  const {selectedWalletId} = nftStore;

  const [error, setError] = useState<string | null>(null);
  const [nodeForOdyssey, setNodeForOdyssey] = useState<any>(null);

  const [nodeId, setNodeId] = useState<string>();
  const [odysseyId, setOdysseyId] = useState<string>();

  const {
    isBlockchainReady,
    walletSelectContent,
    account,
    setOdysseyMapping,
    setNodeMapping,
    removeMapping,
    getNodeForTheOdyssey
  } = useBlockchain({
    requiredAccountAddress: selectedWalletId
  });

  const handleAddMapping = async () => {
    try {
      console.log('handleAddMapping');
      setError(null);

      if (!nodeId || !odysseyId) {
        throw new Error('Missing required fields');
      }

      const signedChallenge = await adminStore.getNodeSignedChallenge(odysseyId);
      console.log('challenge for odyssey', odysseyId, signedChallenge);

      if (!signedChallenge) {
        throw new Error('Missing challenge');
      }

      await setOdysseyMapping(nodeId, odysseyId, signedChallenge);
      console.log('handleAddMapping done');
    } catch (err: any) {
      console.log('handleAddMapping error', err);
      setError(err.message);
    }
  };

  const handleAddNodeMapping = async () => {
    try {
      console.log('handleAddNodeMapping');
      setError(null);

      if (!nodeId || !odysseyId) {
        throw new Error('Missing required fields');
      }

      await setNodeMapping(nodeId, odysseyId);
      console.log('handleAddNodeMapping done');
    } catch (err: any) {
      console.log('handleAddNodeMapping error', err);
      setError(err.message);
    }
  };

  const handleRemoveMapping = async () => {
    try {
      console.log('handleRemoveMapping');
      setError(null);

      if (!nodeId || !odysseyId) {
        throw new Error('Missing required fields');
      }

      await removeMapping(nodeId, odysseyId);

      console.log('handleRemoveMapping done');
    } catch (err: any) {
      console.log('handleRemoveMapping error', err);
      setError(err.message);
    }
  };

  const handleGetNodeForTheOdyssey = async () => {
    try {
      console.log('handleGetNodeForTheOdyssey');
      setError(null);

      if (!odysseyId) {
        throw new Error('Missing required fields');
      }

      const nodeForOdyssey = await getNodeForTheOdyssey(odysseyId);

      console.log('handleGetNodeForTheOdyssey done', nodeForOdyssey);

      setNodeForOdyssey(nodeForOdyssey);
    } catch (err: any) {
      console.log('handleGetNodeForTheOdyssey error', err);
      setError(err.message);
    }
  };

  return (
    <>
      <div>Account: {account}</div>
      {walletSelectContent}

      <styled.Form>
        <div>Node ID (UUID)</div>
        <Input value={nodeId} onChange={setNodeId} />

        <div>Odyssey ID (UUID)</div>
        <Input value={odysseyId} onChange={setOdysseyId} />
      </styled.Form>

      <Button onClick={handleAddMapping} disabled={!isBlockchainReady} label="Add Mapping" />

      <br />

      <Button
        onClick={handleAddNodeMapping}
        disabled={!isBlockchainReady}
        label="Add Node Mapping"
      />

      <br />

      <Button onClick={handleRemoveMapping} disabled={!isBlockchainReady} label="Remove Mapping" />
      <br />
      <hr />
      <br />
      <Button
        onClick={handleGetNodeForTheOdyssey}
        disabled={!isBlockchainReady}
        label="Get Node For The Odyssey"
      />

      {!!nodeForOdyssey && <pre>nodeForOdyssey: {JSON.stringify(nodeForOdyssey, null, 2)}</pre>}

      {!!error && <div>Error: {error}</div>}
    </>
  );
};

const NodeReg: FC = () => {
  const {nftStore, adminStore} = useStore();
  const {selectedWalletId} = nftStore;

  const [error, setError] = useState<string | null>(null);
  const [nodeInfo, setNodeInfo] = useState<any>(null);

  const [nodeId, setNodeId] = useState<string>();
  const [hostname, setHostname] = useState<string>();
  const [name, setName] = useState<string>();

  useEffect(() => {
    adminStore.attrNodePublicKey.load();
  }, [adminStore]);

  const pubkey = adminStore.attrNodePublicKey?.value?.node_public_key as string | undefined;

  const {
    isBlockchainReady,
    walletSelectContent,
    account,
    addNodeWithMom,
    addNodeWithEth,
    updateNode,
    removeNode,
    getNodeInfo
  } = useBlockchain({
    requiredAccountAddress: selectedWalletId
  });

  const handleAddNodeWithMom = async () => {
    try {
      console.log('handleAddNodeWithMom');
      setError(null);

      if (!nodeId || !hostname || !name || !pubkey) {
        throw new Error('Missing required fields');
      }

      await addNodeWithMom(nodeId, hostname, name, pubkey, NODE_ADDING_FEE);
      console.log('handleAddNodeWithMom done');
    } catch (err: any) {
      console.log('handleAddNodeWithMom error', err);
      setError(err.message);
    }
  };
  const handleAddNodeWithEth = async () => {
    try {
      console.log('handleAddNodeWithEth');
      setError(null);

      if (!nodeId || !hostname || !name || !pubkey) {
        throw new Error('Missing required fields');
      }

      await addNodeWithEth(nodeId, hostname, name, pubkey, NODE_ADDING_FEE);
      console.log('handleAddNodeWithEth done');
    } catch (err: any) {
      console.log('handleAddNodeWithEth error', err);
      setError(err.message);
    }
  };
  const handleUpdateNode = async () => {
    try {
      console.log('handleUpdateNode');
      setError(null);

      if (!nodeId || !hostname || !name) {
        throw new Error('Missing required fields');
      }

      await updateNode(nodeId, hostname, name);

      console.log('handleUpdateNode done');
    } catch (err: any) {
      console.log('handleUpdateNode error', err);
      setError(err.message);
    }
  };

  const handleRemoveNode = async () => {
    try {
      console.log('handleRemoveNode');
      setError(null);

      if (!nodeId) {
        throw new Error('Missing required fields');
      }

      await removeNode(nodeId);

      console.log('handleRemoveNode done');
    } catch (err: any) {
      console.log('handleRemoveNode error', err);
      setError(err.message);
    }
  };

  const handleGetNodeInfo = async () => {
    try {
      console.log('handleGetNodeInfo');
      setError(null);

      if (!nodeId) {
        throw new Error('Missing required fields');
      }

      const nodeInfo = await getNodeInfo(nodeId);

      console.log('handleGetNodeInfo done', nodeInfo);

      setNodeInfo(nodeInfo);
    } catch (err: any) {
      console.log('handleGetNodeInfo error', err);
      setError(err.message);
    }
  };

  return (
    <>
      <div>Account: {account}</div>
      {walletSelectContent}

      <styled.Form>
        <div>Node ID (UUID)</div>
        <Input value={nodeId} onChange={setNodeId} />

        <div>Hostname</div>
        <Input value={hostname} onChange={setHostname} />

        <div>Name</div>
        <Input value={name} onChange={setName} />
      </styled.Form>

      <Button
        onClick={handleAddNodeWithMom}
        disabled={!isBlockchainReady}
        label="Add Node With MOM"
      />
      <br />
      <Button
        onClick={handleAddNodeWithEth}
        disabled={!isBlockchainReady}
        label="Add Node With ETH"
      />
      <br />
      <Button onClick={handleUpdateNode} disabled={!isBlockchainReady} label="Update Node" />
      <br />
      <Button onClick={handleRemoveNode} disabled={!isBlockchainReady} label="Remove Node" />
      <br />
      <hr />
      <br />
      <Button onClick={handleGetNodeInfo} disabled={!isBlockchainReady} label="Get Node Info" />
      <br />
      {!!nodeInfo && (
        <pre>
          Node Info:{' '}
          {JSON.stringify(
            {
              node_id: nodeInfo.node_id,
              hostname: nodeInfo.hostname,
              name: nodeInfo.name,
              owner: nodeInfo.owner
            },
            null,
            2
          )}
        </pre>
      )}
      {!!error && <div>Error: {error}</div>}
    </>
  );
};

type TabsType = 'blockchain' | 'api_keys' | 'mapping' | 'reg';

const TABS_LIST: TabInterface<TabsType>[] = [
  {id: 'blockchain', icon: 'connect', label: 'Blockchain registration'},
  {id: 'api_keys', icon: 'key', label: 'API Keys'},
  ...((process.env.NODE_ENV === 'development'
    ? [
        {id: 'mapping', icon: 'info', label: 'mapping'},
        {id: 'reg', icon: 'info', label: 'test register'}
      ]
    : []) as TabInterface<TabsType>[])
];

const NodeConfig = () => {
  const {nftStore} = useStore();
  const {selectedWalletId} = nftStore;

  const [activeTab, setActiveTab] = useState<TabsType>('blockchain');

  if (!selectedWalletId) {
    return <div>...</div>;
  }

  return (
    <styled.Container>
      <Panel
        size="wide"
        isFullHeight
        variant="primary"
        icon="rabbit"
        title="Node Management Console"
      >
        <styled.Content>
          <Tabs tabList={TABS_LIST} activeId={activeTab} onSelect={setActiveTab} stickToTopRight />
          <Frame>
            {activeTab === 'blockchain' && <BlockchainRegistration />}

            {activeTab === 'api_keys' && <ApiKeys />}

            {activeTab === 'mapping' && <NodeOdysseyMapping />}

            {activeTab === 'reg' && <NodeReg />}
          </Frame>
        </styled.Content>
      </Panel>
    </styled.Container>
  );
};

export default observer(NodeConfig);
