import React from 'react';

import Button from './Button';
import background from '../../static/images/bg.png';

export interface ChooseLoginProps {
  onPick: (method: any) => void;
}

const ChooseLogin: React.FC<ChooseLoginProps> = (props: ChooseLoginProps) => {
  const loginMethods = [
    {name: 'Web3 Wallet', type: 'web3'},
    {name: 'Momentum Account', type: 'keycloak'}
  ];

  const clickHandler = (method) => {
    console.info(method);
    props.onPick(method);
  };

  return (
    <div className="z-pop-over fixed inset-0 flex flex-col justify-center items-center bg-dark-blue-100">
      <div
        className="absolute inset-0 bg-red-sunset-10 bg-no-repeat bg-cover"
        style={{backgroundImage: `url(${background})`}}
      ></div>
      <div className="text-center mt-2">
        <h2 className="text-[2.23rem] m-2">Choose your way to connect to Odyssey Momentum</h2>
        <div className="flex flex-wrap justify-center p-4">
          {loginMethods.map((item) => (
            // eslint-disable-next-line react/jsx-key
            <div className="block w-full md:w-auto mb-2 md:ml-4">
              <Button type="primary" block={true} size="l" onClick={() => clickHandler(item)}>
                {item.name}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChooseLogin;
