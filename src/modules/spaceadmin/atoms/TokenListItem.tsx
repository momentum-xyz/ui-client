const TokenListItem = ({title, content}) => {
  return (
    <div className="">
      <h6 className="font-bold uppercase text-white-100 mt-2 text-s">{title}</h6>
      <p className="text-md mt-.1 font-normal text-white-100 mr-2 truncate">{content}</p>
    </div>
  );
};

export default TokenListItem;
