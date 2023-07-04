import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, Frame, Input} from '@momentum-xyz/ui-kit';
import {Controller, useForm} from 'react-hook-form';

import {useStore} from 'shared/hooks';

import * as styled from './Admins.styled';

interface WalletAddressInterface {
  address: string;
}

const Admins: FC = () => {
  const worldMembers = useStore().universeStore.world2dStore?.worldMembers;

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset
    // setError
  } = useForm<WalletAddressInterface>();

  const formatSubmitHandler = ({address}: WalletAddressInterface) => {
    console.log(address);
    worldMembers
      ?.addMember(address)
      .then((res) => {
        console.log(res);
        reset();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = (userId: string) => {
    worldMembers
      ?.deleteMember(userId)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <styled.Container>
      <Frame>
        <styled.Head>
          <styled.Title>Add new member</styled.Title>
          <styled.Text>
            Co-create with other people inside your Odyssey! To be able to co-create with others;
            add their wallet address below and add them to your co-creators member list to start
            building with them
          </styled.Text>
          <Controller
            control={control}
            name="address"
            rules={{
              required: {
                value: true,
                message: 'Wallet address is required'
              },
              pattern: {
                value: /^0x[a-fA-F0-9]{40}$/,
                message: 'Invalid wallet address'
              }
            }}
            render={({field: {value, onChange}}) => (
              <Input
                placeholder="Wallet address"
                onChange={onChange}
                danger={!!errors.address}
                wide
                value={value}
                onEnter={() => {
                  handleSubmit(formatSubmitHandler)();
                }}
              />
            )}
          />
          <styled.Title>Co-Creation Member List</styled.Title>
          <styled.Text>
            Below is a list of all the users who can build in your Odyssey with you.{' '}
          </styled.Text>
        </styled.Head>
        <div>
          {worldMembers?.members.map(({user_id, name, avatar_hash}) => (
            <div key={user_id} style={{padding: 10, margin: 10, border: '1px solid red'}}>
              {name} {user_id} {avatar_hash}{' '}
              <Button label="Remove" onClick={() => handleDelete(user_id)} />
            </div>
          ))}
        </div>
      </Frame>
    </styled.Container>
  );
};

export default observer(Admins);
