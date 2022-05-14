import React, {ReactNode} from 'react';
import Linkify from 'react-linkify';

import {useImageBase64Cache} from '../../../hooks/useImageBase64Cache';
import Panel from '../Panel';

export interface SimpleTileProps {
  icon: string;
  title: string;
  text: ReactNode;
}

const SimpleTile: React.FC<SimpleTileProps> = ({icon, title, text, children}) => {
  const cachedUrl = useImageBase64Cache(icon);
  return (
    <Panel grow={false} className="group mb-1 relative">
      <div className="w-full flex mb-1">
        <h3 className="flex-grow font-bold uppercase ">{title}</h3>
        <div className="w-2 flex-none">
          <img src={cachedUrl} className="h-1.6" alt="Expand" />
        </div>
      </div>
      <div className="text-sm whitespace-pre-wrap break-all hyphens-auto">
        <Linkify
          componentDecorator={(decoratedHref, decoratedText, key) => (
            <a
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
              href={decoratedHref}
              key={key}
            >
              {decoratedText}
            </a>
          )}
        >
          {text}
        </Linkify>
      </div>
      {children}
    </Panel>
  );
};

export default SimpleTile;
