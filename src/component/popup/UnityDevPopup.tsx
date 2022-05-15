import React, {useState} from 'react';

import {UnityEventEmitter, UnityEvents} from '../../context/Unity/UnityService';
import Button from '../atoms/Button';
import Input, {Checkbox} from '../atoms/input/Input';
import Select, {Option} from '../atoms/input/Select';
import Popup, {PopupTitle} from '../atoms/Popup';

const Events: {[key in keyof UnityEvents]: string[]} = {
  MomentumLoaded: [],
  TeleportReady: [],
  ExterminateUnity: ['topic'],
  PublishMessage: ['topic', 'message'],
  SubscribeToTopic: ['topic'],
  UnsubscribeFromTopic: ['topic'],
  ClickEventVideo: ['id'],
  ClickEventDashboard: ['id'],
  Screen1ClickEvent: ['id'],
  Screen2ClickEvent: ['id'],
  Screen3ClickEvent: ['id'],
  PlasmaClickEvent: ['id'],
  ProfileClickEvent: ['id', 'position'],
  Error: ['message']
};

export type UnityDevPopupProps = {onClose?: () => void};
export const UnityDevPopup: React.FC<UnityDevPopupProps> = ({onClose}) => {
  const [close, setClose] = useState(true);
  const [type, setType] = useState('MomentumLoaded');
  const [formData, setFormData] = useState({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  // @ts-ignore
  const submit = (event) => {
    event.preventDefault();
    // @ts-ignore
    if (Events[type].length > 0) {
      // @ts-ignore
      const vars = Events[type].map((key) => {
        if (key === 'position') {return {x: 0, y: 0, z: 0};}
        // @ts-ignore
        return formData[key];
      });
      console.info(`Emitting a "${type}" unity event: `, vars);
      UnityEventEmitter.emit(type as keyof UnityEvents, ...vars);
    } else {
      console.info(`Emitting a "${type}" unity event`);
      UnityEventEmitter.emit(type as keyof UnityEvents);
    }
    if (close && onClose) {onClose();}
  };

  return (
    <Popup className="w-64 right-1 bottom-8" center={false}>
      <PopupTitle onClose={onClose}>Unity dev tools</PopupTitle>
      <form onSubmit={submit}>
        <Select name="type" onChange={(e) => setType(e.target.value)}>
          {Object.keys(Events).map((type) => (
            <Option key={type} value={type}>
              {type}
            </Option>
          ))}
        </Select>
        {/* @ts-ignore */}
        {Events[type].map((key) => {
          if (key === 'position') {return null;}
          // if(key === "owner") return (
          // <Select name={key} onChange={handleChange}>
          //     {Object.keys(OwnerType).map((type, i) => (
          //         <Option value={type}>{type}</Option>
          //     ))}
          // </Select>
          // )
          return <Input key={key} type="text" label={key} name={key} onChange={handleChange} />;
        })}
        <Checkbox
          name="close"
          checked={close}
          onChange={() => setClose((a) => !a)}
          label="Close popup after send"
        />
        <div className="flex gap-1 mt-2">
          <Button type="primary" submit>
            Send
          </Button>
        </div>
      </form>
    </Popup>
  );
};

export default UnityDevPopup;
