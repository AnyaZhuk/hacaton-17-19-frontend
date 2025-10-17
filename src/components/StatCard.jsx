const StatCard = ({ title, value, subValue }) => (
  <div className="bg-slate-800/50 p-4 rounded-xl text-center border border-transparent hover:border-cyan-400 transition-all duration-300">
    <p className="text-sm text-gray-400">{title}</p>
    <p className="text-3xl font-bold text-white">{value}</p>
    {subValue && <p className="text-sm text-green-400 font-semibold">{subValue}</p>}
  </div>
);

export default StatCard;