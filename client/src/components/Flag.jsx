const Flag = ({ countryCode, className }) => {
  if (!countryCode) return null;
  return (
    <img
      className={className}
      src={`https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`}
      alt={countryCode}
    />
  );
};

export default Flag;
