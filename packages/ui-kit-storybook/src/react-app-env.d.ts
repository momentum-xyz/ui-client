declare module '*.svg' {
  import React from 'react';

  const svgUrl: string;
  const svgComponent: React.StatelessComponent<React.SVGAttributes<SVGElement>>;
  export default svgUrl;
  export {svgComponent as ReactComponent};
}
