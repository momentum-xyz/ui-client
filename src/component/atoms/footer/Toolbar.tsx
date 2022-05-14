export type ToolbarProps = unknown;
export const Toolbar: React.FC<ToolbarProps> = ({children}) => {
  return (
    <div className="h-4 flex rounded-lg bg-gradient-dark-blue-black-50 m-1 align-center px-1">
      {children}
    </div>
  );
};

export default Toolbar;
