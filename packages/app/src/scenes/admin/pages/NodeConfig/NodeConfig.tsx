import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, Input, Panel} from '@momentum-xyz/ui-kit';
import BN from 'bn.js';

import {useBlockchain, useStore} from 'shared/hooks';

import * as styled from './NodeConfig.styled';

const NODE_ADDING_FEE = new BN('4200000000000000000');

const uuidToDecString = (uuid: string) => {
  return new BN(uuid.replace(/-/g, ''), 16).toString(10);
};

const uuidToHex = (uuid: string) => {
  return `0x${uuid.replace(/-/g, '')}`;
};

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

      // const odysseyIdDec = uuidToDecString(odysseyId);
      // console.log('Convert odysseyId to decimal', odysseyId, '-->', odysseyIdDec);

      // const nodeIdDec = uuidToDecString(nodeId);
      // console.log('Convert nodeId to decimal', nodeId, '-->', nodeIdDec);

      const signedChallenge = await adminStore.getNodeSignedChallenge(odysseyId);
      console.log('challenge for odyssey', odysseyId, signedChallenge);

      const hexNodeId = uuidToHex(nodeId);
      const hexOdysseyId = uuidToHex(odysseyId);

      console.log('setOdysseyMapping', {hexNodeId, hexOdysseyId, challenge: signedChallenge});

      if (!signedChallenge) {
        throw new Error('Missing challenge');
      }

      await setOdysseyMapping(hexNodeId, hexOdysseyId, signedChallenge);
      console.log('handleAddMapping done');
    } catch (err: any) {
      console.log('handleAddMapping error', err);
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

      const nodeForOdyssey = await getNodeForTheOdyssey(uuidToHex(odysseyId));

      console.log('handleGetNodeForTheOdyssey done', nodeForOdyssey);

      setNodeForOdyssey(nodeForOdyssey);
    } catch (err: any) {
      console.log('handleGetNodeForTheOdyssey error', err);
      setError(err.message);
    }
  };

  return (
    <styled.Container>
      <Panel size="large" isFullHeight variant="primary" icon="rabbit" title="Node Admin">
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
          onClick={handleRemoveMapping}
          disabled={!isBlockchainReady}
          label="Remove Mapping"
        />
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
      </Panel>
    </styled.Container>
  );
};

const NodeConfig: FC = () => {
  const {nftStore} = useStore();
  const {selectedWalletId} = nftStore;

  const [error, setError] = useState<string | null>(null);
  const [nodeInfo, setNodeInfo] = useState<any>(null);

  const [nodeId, setNodeId] = useState<string>();
  const [hostname, setHostname] = useState<string>();
  const [name, setName] = useState<string>();

  const {
    isBlockchainReady,
    walletSelectContent,
    account,
    addNode,
    updateNode,
    removeNode,
    getNodeInfo
  } = useBlockchain({
    requiredAccountAddress: selectedWalletId
  });

  const handleAddNode = async () => {
    try {
      console.log('handleAddNode');
      setError(null);

      if (!nodeId || !hostname || !name) {
        throw new Error('Missing required fields');
      }

      const nodeIdDec = uuidToDecString(nodeId);

      await addNode(nodeIdDec, hostname, name, NODE_ADDING_FEE);
      console.log('handleAddNode done');
    } catch (err: any) {
      console.log('handleAddNode error', err);
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
      const nodeIdDec = uuidToDecString(nodeId);

      await updateNode(nodeIdDec, hostname, name);

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
      const nodeIdDec = uuidToDecString(nodeId);

      await removeNode(nodeIdDec);

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
      const nodeIdHex = uuidToHex(nodeId);

      const nodeInfo = await getNodeInfo(nodeIdHex);

      console.log('handleGetNodeInfo done', nodeInfo);

      setNodeInfo(nodeInfo);
    } catch (err: any) {
      console.log('handleGetNodeInfo error', err);
      setError(err.message);
    }
  };

  return (
    <styled.Container>
      <Panel size="large" isFullHeight variant="primary" icon="rabbit" title="Node Admin">
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

        <Button onClick={handleAddNode} disabled={!isBlockchainReady} label="Add Node" />
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
      </Panel>
    </styled.Container>
  );
};

const SideBySide = () => {
  return (
    <div style={{display: 'flex', justifyContent: 'space-around'}}>
      <NodeOdysseyMapping />
      <NodeConfig />
    </div>
  );
};

export default observer(SideBySide);
