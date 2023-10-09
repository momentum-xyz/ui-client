import {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Controller, useForm} from 'react-hook-form';
import {Button, Input} from '@momentum-xyz/ui-kit';
import {toast} from 'react-toastify';
import {BN} from 'bn.js';

import {NodeConfigInputType, NodeConfigInterface} from 'core/models';
import {useBlockchain, useStore} from 'shared/hooks';
import {appVariables} from 'api/constants';
import {ToastContent} from 'ui-kit';

import {NodeWhitelist} from './components';
import * as styled from './BlockchainRegistration.styled';

const NODE_ADDING_FEE = '4200000000000000000';

const BlockchainRegistration: FC = () => {
  const {nftStore, adminStore} = useStore();
  const {selectedWalletId} = nftStore;

  const nodeId = appVariables.NODE_ID;

  const {
    isBlockchainReady,
    walletSelectContent,
    account,
    addNodeWithMom,
    updateNode,
    removeNode,
    getNodeInfo
  } = useBlockchain({
    requiredAccountAddress: selectedWalletId
  });

  useEffect(() => {
    adminStore.attrNodePublicKey.load();
  }, [adminStore]);
  const pubkey = adminStore.attrNodePublicKey?.value?.node_public_key as string | undefined;

  const [nodeConfig, setNodeConfig] = useState<NodeConfigInterface | null | undefined>();
  const nodeConfigLoading = nodeConfig === undefined;

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors, dirtyFields}
  } = useForm<NodeConfigInputType>();

  const refreshNodeInfo = useCallback(() => {
    getNodeInfo(nodeId).then((nodeConfig) => {
      console.log('getNodeInfo', nodeConfig);

      setNodeConfig(nodeConfig);

      if (nodeConfig) {
        setValue('hostname', nodeConfig.hostname, {shouldDirty: false});
        setValue('name', nodeConfig.name, {shouldDirty: false});
      }
    });
  }, [getNodeInfo, nodeId, setValue]);

  useEffect(() => {
    refreshNodeInfo();
  }, [refreshNodeInfo]);

  const isModified = Object.keys(dirtyFields).length > 0;

  const handleSave = async (data: NodeConfigInputType) => {
    if (!pubkey) {
      toast.error(<ToastContent icon="alert" text="Missing public key" />);
      return;
    }

    console.log('BlockchainRegistration', data);
    try {
      if (nodeConfig) {
        await updateNode(nodeId, data.hostname, data.name);
        toast.info(<ToastContent icon="checked" text="Registered successfully" />);
      } else {
        await addNodeWithMom(nodeId, data.hostname, data.name, pubkey, new BN(NODE_ADDING_FEE));
        toast.info(<ToastContent icon="checked" text="Updated successfully" />);

        refreshNodeInfo();
      }
    } catch (err: any) {
      console.log('handleSave error', err);
      toast.error(<ToastContent icon="alert" text="Something went wrong" />);
    }
  };

  const handleRemove = async () => {
    console.log('BlockchainRegistration remove');
    try {
      await removeNode(nodeId);
      toast.info(<ToastContent icon="checked" text="Unregistered successfully" />);
      setNodeConfig(null);
    } catch (err: any) {
      console.log('handleRemove error', err);
      toast.error(<ToastContent icon="alert" text="Something went wrong" />);
    }
  };

  return (
    <>
      <styled.Form>
        <styled.Title>Register node on blockchain</styled.Title>
        <styled.Text>
          You need to specify the hostname and name of the node you want to register. Other data
          like node ID, node public key and owner address will be taken automatically.
        </styled.Text>

        <styled.Title>Hostname</styled.Title>
        <Controller
          control={control}
          name="hostname"
          rules={{
            required: {
              value: true,
              message: 'Hostname is required'
            },
            pattern: {
              value: /\S+\.\S+/,
              message: 'Invalid hostname format'
            }
          }}
          render={({field: {value, onChange}}) => (
            <Input
              placeholder="Hostname"
              onChange={onChange}
              danger={!!errors.hostname}
              wide
              value={value} // ?? nodeConfig?.hostname}
            />
          )}
        />

        <styled.Title>Name</styled.Title>
        <Controller
          control={control}
          name="name"
          rules={{
            required: {
              value: true,
              message: 'Name is required'
            }
          }}
          render={({field: {value, onChange}}) => (
            <Input
              placeholder="Name"
              onChange={onChange}
              danger={!!errors.name}
              wide
              value={value} //?? nodeConfig?.name}
            />
          )}
        />

        <styled.Title>Owner</styled.Title>
        <Input onChange={() => {}} wide value={account} disabled />

        {walletSelectContent}
        <styled.ActionsBar>
          <Button
            label="Unregister"
            onClick={handleRemove}
            disabled={!isBlockchainReady || !nodeConfig}
          />
          <Button
            label={nodeConfig ? 'Update' : 'Register'}
            onClick={handleSubmit(handleSave)}
            disabled={!isBlockchainReady || !isModified || nodeConfigLoading}
          />
        </styled.ActionsBar>
      </styled.Form>

      <NodeWhitelist />
    </>
  );
};

export default observer(BlockchainRegistration);
