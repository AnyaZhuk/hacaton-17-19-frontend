const StatCard = ({ title, value, subValue, highlight }) => {
  let baseBorderColor = 'border-transparent hover:border-cyan-400';
  let baseTextColor = 'text-white';
  let baseSubTextColor = 'text-green-400'; 

  if (highlight === 'red') {
    baseBorderColor = 'border-red-700/50 hover:border-red-400';
    baseTextColor = 'text-red-400';
    baseSubTextColor = 'text-red-300';
  } else if (highlight === 'green') {
    baseBorderColor = 'border-green-700/50 hover:border-green-400';
    baseTextColor = 'text-green-400';
    baseSubTextColor = 'text-green-400';
  }

  return (
    <div className={`bg-slate-800/50 p-4 rounded-xl text-center border transition-all duration-300 ${baseBorderColor}`}>
      <p className="text-sm text-gray-400">{title}</p>
      <p className={`text-3xl font-bold truncate ${baseTextColor}`}>{value}</p>
      
      {subValue && (
        <p className={`text-sm font-semibold ${baseSubTextColor}`}>
          {subValue}
        </p>
      )}
    </div>
  );
};

export default StatCard;