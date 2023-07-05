import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Hexagon, Frame, Input, IconButton} from '@momentum-xyz/ui-kit';
import {Controller, useForm} from 'react-hook-form';
import {toast} from 'react-toastify';

import {useStore} from 'shared/hooks';
import {getImageAbsoluteUrl} from 'core/utils';
import {ToastContent} from 'ui-kit';

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
    reset,
    setError
  } = useForm<WalletAddressInterface>();

  const formSubmitHandler = ({address}: WalletAddressInterface) => {
    console.log(address);
    worldMembers
      ?.addMember(address)
      .then((res) => {
        toast.info(<ToastContent icon="checked" text="Co-creator added successfully" />);
        reset();
      })
      .catch((err) => {
        console.log(err);
        setError('address', {
          type: 'manual',
          message: err.message
        });
        toast.error(<ToastContent icon="alert" text="Something went wrong" />);
      });
  };

  const handleDelete = (userId: string) => {
    worldMembers
      ?.deleteMember(userId)
      .then((res) => {
        toast.info(<ToastContent icon="checked" text="Co-creator deleted successfully" />);
      })
      .catch((err) => {
        console.log(err);
        toast.error(<ToastContent icon="alert" text="Something went wrong" />);
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
                  handleSubmit(formSubmitHandler)();
                }}
                actionRight={
                  <IconButton isWhite name="add" onClick={handleSubmit(formSubmitHandler)} />
                }
              />
            )}
          />
          <styled.Title>Co-Creation Member List</styled.Title>
          <styled.Text>
            Below is a list of all the users who can build in your Odyssey with you.{' '}
          </styled.Text>
        </styled.Head>
        <styled.UserList>
          {worldMembers?.members.map(({user_id, name, avatar_hash}) => (
            <styled.UserItem key={user_id}>
              <Hexagon
                type="fourth-borderless"
                skipOuterBorder
                imageSrc={getImageAbsoluteUrl(avatar_hash)}
                iconName="astronaut"
              />
              <styled.UserName>{name}</styled.UserName>
              <styled.ItemAction>
                <styled.CircleButton onClick={() => handleDelete(user_id)}>-</styled.CircleButton>
              </styled.ItemAction>
            </styled.UserItem>
          ))}
        </styled.UserList>
      </Frame>
    </styled.Container>
  );
};

export default observer(Admins);
