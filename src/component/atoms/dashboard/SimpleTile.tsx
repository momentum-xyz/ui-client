import React, {ReactNode} from 'react';
import Linkify from 'react-linkify';

import {IconSvg} from 'ui-kit';

import Panel from '../Panel';

export interface SimpleTileProps {
  title: string;
  text: ReactNode;
}

const SimpleTile: React.FC<SimpleTileProps> = ({title, text, children}) => {
  return (
    <Panel grow={false} className="group mb-1 relative">
      <div className="w-full flex justify-between mb-1">
        <h3 className="flex-grow font-bold uppercase ">{title}</h3>
        <IconSvg name="questions" size="small" isWhite />
      </div>
      <div className="text-sm whitespace-pre-wrap hyphens-auto">
        <Linkify
          // @ts-ignore: refactoring
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
          {/* @ts-ignore: refactoring */}
          {text}
        </Linkify>
      </div>
      {children}
    </Panel>
  );
};

export default SimpleTile;
