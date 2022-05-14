import React, {useEffect} from 'react';
import {useState} from 'react';

import {ReactComponent as AstronautIcon} from '../../images/icons/professions-man-astronaut.svg';

export interface AvatarProps {
  className?: string | null;
  avatarHash?: string | null;
  size?: 'social' | 'xs' | 's' | 'xm' | 'm' | 'l';
  onClick?: () => void;
}

const sizeStyle = {
  social:
    'bg-black-100 h-2.8 w-2.8 rounded-full flex items-center text-prime-blue-100 justify-center overflow-hidden',
  xs: 'bg-black-100 h-2.5 w-2.5 rounded-full flex items-center text-prime-blue-100 justify-center overflow-hidden',
  s: 'bg-black-100 h-3.8 w-3.8 rounded-full flex items-center text-prime-blue-100 justify-center overflow-hidden',
  xm: 'bg-black-100 h-6 w-6 rounded-full flex items-center text-prime-blue-100 justify-center overflow-hidden',
  m: 'bg-black-100 w-8 h-8 rounded-full flex items-center text-prime-blue-100 justify-center overflow-hidden',
  l: 'bg-black-100 w-20 h-20 rounded-full flex items-center text-prime-blue-100 justify-center overflow-hidden'
};

const avatarSizeStyle = {
  social: 'w-full h-full object-cover',
  xs: 'w-full h-full object-cover',
  s: 'w-full h-full object-cover',
  xm: 'w-full h-full object-cover',
  m: 'w-8 h-8 object-cover',
  l: 'w-full h-full object-cover'
};

const astronautSizeStyle = {
  social: 'w-1.5 h-1.5',
  xs: 'w-1.25 h-1.25',
  s: 'w-2 h-2',
  xm: 'w-3 h-3',
  m: 'w-4 h-4',
  l: 'w-17 h-17'
};

const Avatar: React.FC<AvatarProps> = ({className, avatarHash, size = 'm', onClick}) => {
  const [imgUrl, setImgUrl] = useState<string | null>();

  useEffect(() => {
    if (avatarHash) {
      setImgUrl(window._env_.RENDER_SERVICE_URL + `/get/${avatarHash}`);
    } else {
      setImgUrl(null);
    }
  }, [avatarHash]);

  return (
    <div className={`${className ?? ''}`} onClick={onClick}>
      <div className={`${sizeStyle[size]}`}>
        {imgUrl ? (
          <img src={imgUrl} className={`${avatarSizeStyle[size]}`} alt={imgUrl} />
        ) : (
          <AstronautIcon className={`${astronautSizeStyle[size]}`} />
        )}
      </div>
    </div>
  );
};

export default Avatar;
