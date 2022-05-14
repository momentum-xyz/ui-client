import React, {HTMLAttributes} from 'react';

import {ReactComponent as MomentumLogo} from '../../images/Odyssey-Momentum-logo.svg';

export interface LogoProps extends HTMLAttributes<HTMLDivElement> {}

const Logo: React.FC<LogoProps> = (props) => {
  return (
    <div className={props.className}>
      <figure>
        <MomentumLogo className="w-full" />
      </figure>
    </div>
  );
};

export default Logo;
