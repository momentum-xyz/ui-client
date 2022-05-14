import React from 'react';

export interface LoaderProps {}

const Loader: React.FC<LoaderProps> = () => {
  return (
    <div className="loader">
      <figure>
        <img className="logo-stamp" src="/icons/odyssey-stamp.svg" alt="Loader" />
      </figure>
    </div>
  );
};

export default Loader;
