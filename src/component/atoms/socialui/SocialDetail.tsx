import React from 'react';

export interface SocialDetailProps {
  title: string;
  content: string;
}

const SocialDetail: React.FC<SocialDetailProps> = ({title, content}) => {
  return (
    <div>
      <h1 className="text-sm">{title}</h1>
      <div className="text-xs font-light">{content}</div>
    </div>
  );
};

export default SocialDetail;
