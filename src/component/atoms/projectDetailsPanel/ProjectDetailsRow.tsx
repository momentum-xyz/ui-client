import React from 'react';

const ProjectDetailsRow: React.FC = ({children}) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <div className="flex flex-row pt-2 border-t-1 mb-1 border-black-50">
      {childrenArray.map((child, index) => {
        return (
          <div
            key={`${index}`}
            className={
              'w-full pr-2' +
              (index < childrenArray.length - 1 ? ' border-r-1 border-black-50 mr-2' : '')
            }
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};

export default ProjectDetailsRow;
