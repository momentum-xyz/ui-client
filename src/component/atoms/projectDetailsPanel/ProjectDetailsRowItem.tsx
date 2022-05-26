import React from 'react';

export interface ProjectDetailsRowItemProps {
  title: string;
}

const ProjectDetailsRowItem: React.FC<ProjectDetailsRowItemProps> = ({title, children}) => (
  <div>
    <h6 className="font-bold text-white-100 font-sans tracking-widest text-xs uppercase pb-1">
      {title}
    </h6>
    {children}
  </div>
);

export default ProjectDetailsRowItem;
