const TokenDetails = ({title, content}) => {
  return (
    <div className="w-full bg-gradient-input mb-1">
      <label className="block pt-2 px-2 mb-0 font-bold text-white-100 font-sans text-sm uppercase">
        {title}
      </label>
      <p
        className={`bg-transparant focus-visible:shadow-none w-full px-2 pb-2 pt-1 ${
          title.includes('smart') ? '' : 'uppercase'
        }`}
      >
        {content}
      </p>
    </div>
  );
};

export default TokenDetails;
