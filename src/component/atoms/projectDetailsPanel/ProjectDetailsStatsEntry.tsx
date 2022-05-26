import React from 'react';

export interface ProjectDetailsStatsEntryProps {
  name: string;
  value: string;
}

const ProjectDetailsStatsEntry: React.FC<ProjectDetailsStatsEntryProps> = ({name, value}) => (
  <div className="flex flex-row">
    {name}
    <div className="flex-grow" />
    <div className="text-green-light-100 font-bold pb-1">{value}</div>
  </div>
);

export default ProjectDetailsStatsEntry;
