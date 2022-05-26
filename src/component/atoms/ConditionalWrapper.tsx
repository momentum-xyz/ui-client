import React, {ReactNode} from 'react';

export interface ConditionalWrapperProps {
  condition: boolean;
  wrapper: (children: ReactNode) => ReactNode;
}

const ConditionalWrapper: React.FC<ConditionalWrapperProps> = ({condition, wrapper, children}) => (
  <> {condition ? wrapper(children) : children} </>
);

export default ConditionalWrapper;
